from rest_framework import serializers
from .models import Song
from apps.genre.models import Genre
from apps.genre.serializers import GenreSerializer

from bson import ObjectId
from mongoengine.errors import DoesNotExist
from datetime import datetime

class SongSerializer(serializers.Serializer):

    id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=255) # Nên có max_length
    genre = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    duration = serializers.IntegerField() # Nên validate > 0
    released_at = serializers.DateTimeField(allow_null=True, required=False) # Cho phép null, không bắt buộc
    deleted_at = serializers.DateTimeField(
        read_only=True, required=False, allow_null=True
    )

    def get_genre(self, obj):
        if not obj.genre:
            return []
        # Truyền context nếu GenreSerializer cần (ví dụ: để tạo URL tuyệt đối cho ảnh genre)
        return GenreSerializer(obj.genre, many=True, context=self.context).data

    def get_user(self, obj):
        from apps.users.serializers import UserListSerializer
        try:
            if not obj.user: # obj.user là một ReferenceField(User)
                return None
            return UserListSerializer(obj.user, context=self.context).data
        except DoesNotExist: # Mặc dù MongoEngine thường tự xử lý, bắt lỗi này cho chắc
            return None
        except ImportError: # Xử lý nếu UserListSerializer không import được (ít khả năng)
            return {"name": "Unknown User"} if obj.user else None


class EnhancedSongSerializer(SongSerializer):
    audio_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()

    def _generate_media_url(self, obj, media_field_name, media_type_in_url_segment):
        media_file_proxy = getattr(obj, media_field_name, None)
        # Kiểm tra media_file_proxy có tồn tại, có thuộc tính 'grid_id', và grid_id có giá trị
        if media_file_proxy and hasattr(media_file_proxy, 'grid_id') and media_file_proxy.grid_id:
            return f"/api/songs/{str(obj.id)}/{media_type_in_url_segment}"
        return None # Trả về None nếu không có file hoặc grid_id

    def get_audio_url(self, obj):
        return self._generate_media_url(obj, "audio", "audio")

    def get_video_url(self, obj):
        return self._generate_media_url(obj, "video", "video")

    def get_cover_url(self, obj):
        return self._generate_media_url(obj, "cover", "cover")


class SongWithOverallStatsSerializer(EnhancedSongSerializer):
    total_listens = serializers.IntegerField(default=0, read_only=True)
    total_downloads = serializers.IntegerField(default=0, read_only=True)

    # total_listens = serializers.SerializerMethodField()
    # total_downloads = serializers.SerializerMethodField()
    #
    # def get_total_listens(self, obj): # obj ở đây là Song instance
    #     return self.context.get('total_listens', 0)
    #
    # def get_total_downloads(self, obj): # obj ở đây là Song instance
    #     return self.context.get('total_downloads', 0)

class UserSongInteractionStatsSerializer(serializers.Serializer):
    """
    Serializer hiển thị một bài hát cùng với số lượt nghe/tải
    của một USER CỤ THỂ đối với bài hát đó.
    """
    song = EnhancedSongSerializer()  # Thông tin chi tiết bài hát
    user_listen_count = serializers.IntegerField(default=0, read_only=True)
    user_download_count = serializers.IntegerField(default=0, read_only=True)


class SongCreateSerializer(serializers.Serializer):
    """Serializer cho việc tạo bài hát mới kèm upload file."""
    title = serializers.CharField(max_length=255)
    # genre_ids sẽ được validate bởi `validate_genre_ids` và chuyển thành list Genre objects
    genre_ids = serializers.ListField(
        child=serializers.CharField(allow_blank=False), # Không cho phép chuỗi rỗng trong list
        required=False, # Cho phép không có genre_ids
        allow_empty=True, # Cho phép list rỗng []
        write_only=True   # Field này chỉ dùng để nhận input
    )
    audio = serializers.FileField(required=True) # File audio là bắt buộc
    video = serializers.FileField(required=False, allow_null=True) # Video không bắt buộc
    cover = serializers.FileField(required=False, allow_null=True) # Cover không bắt buộc
    duration = serializers.IntegerField(required=True, min_value=1) # Duration phải > 0
    released_at = serializers.DateTimeField(required=False, allow_null=True, default=datetime.now)

    def validate_genre_ids(self, list_of_genre_id_strings):
        if not isinstance(list_of_genre_id_strings, list):
            raise serializers.ValidationError("genre_ids must be a list of strings.")

        valid_genre_objects = []
        for genre_id_str in list_of_genre_id_strings:
            if not genre_id_str or not genre_id_str.strip(): # Bỏ qua None hoặc chuỗi rỗng/chỉ có khoảng trắng
                continue
            try:
                genre_id_obj = ObjectId(genre_id_str)
                genre = Genre.objects.get(id=genre_id_obj)
                valid_genre_objects.append(genre)
            except DoesNotExist:
                pass # Bỏ qua nếu genre không tồn tại
            except (ValueError, Exception) as e: # Bắt lỗi format ObjectId hoặc các lỗi khác
                pass # Bỏ qua các ID không hợp lệ
        return valid_genre_objects # Trả về list các Genre objects

    def create(self, validated_data):
        
        genre_objects = validated_data.pop('genre_ids', []) # Lấy ra và xóa khỏi validated_data
        validated_data['genre'] = genre_objects # Gán list Genre objects
        request = self.context.get("request")
        current_user = None
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            current_user = request.user
        
        song_model_user_field = Song._fields.get('user')
        if song_model_user_field and song_model_user_field.required and not current_user:
            raise serializers.ValidationError(
                {"user": "User authentication is required to create a song."}
            )
        validated_data["user"] = current_user

        validated_data.pop('deleted_at', None) # Xóa nếu client có gửi lên


        try:
            song_instance = Song(**validated_data)
            song_instance.save()
        except Exception as e:
            raise serializers.ValidationError(f"Failed to create song: {str(e)}")
            
        return song_instance # Trả về Song instance đã tạo
