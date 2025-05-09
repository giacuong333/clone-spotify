from utils.hash_and_verify_password import hash_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from mongoengine import DoesNotExist
import datetime

# Import models và serializers
from .models import User
from apps.listenedAt.models import ListenedAt
from apps.downloadedAt.models import DownloadedAt
from apps.songs.models import Song
from .serializers import (
    UserDisplaySerializer,
    UserProfileUpdateSerializer,
    UserCreationSerializer,
    UserListSerializer,
    UserDetailSerializer,
    UserUpdateSerializer,
)
from apps.songs.serializers import EnhancedSongSerializer
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
    DestroyAPIView,
    UpdateAPIView,
)
from bson import ObjectId
from rest_framework.exceptions import NotFound


class UserRenderView(ListCreateAPIView):
    serializer_class = UserListSerializer
    permission_classes = [AllowAny]  # For testing

    def get_queryset(self):
        return User.findAllByRoleUser()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# --- Custom Permission Class ---
class IsAdminRole(BasePermission):
    message = "Yêu cầu quyền Admin."


class UserListView(ListCreateAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]  # For testing

    def has_permission(self, request, view):
        if not request.user:
            return False
        if not request.user.is_authenticated:
            return False

        role_direct = getattr(request.user, "role", "Not Found Direct")
        has_admin_role = role_direct == "admin"
        return has_admin_role


# --- Kết thúc Custom Permission Class ---


# === View Đăng Ký ===
class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            hashed_pwd = hash_password(validated_data["password"])
            validated_data["password"] = hashed_pwd
            try:
                user = User(**validated_data)
                user.save()
                display_serializer = UserDisplaySerializer(user)
                return Response(display_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": "Failed to create user."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# === View Cho Admin Quản Lý User ===
class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        try:
            users = User.objects(deleted_at=None)
            serializer = UserDisplaySerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching users."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, deleted_at=None)
            serializer = UserDisplaySerializer(user)
            return Response(serializer.data)
        except DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user:
            return Response(
                {"error": "User not authenticated properly."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = UserDisplaySerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        if not request.user:
            return Response(
                {"error": "User not authenticated properly."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = UserProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            updated_user = serializer.save()
            display_serializer = UserDisplaySerializer(updated_user)
            return Response(display_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Thống kê người dùng ---
class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            listen_count = ListenedAt.objects(user=user).count()
            download_count = DownloadedAt.objects(user=user).count()
            stats_data = {
                "total_listens": listen_count,
                "total_downloads": download_count,
            }
            return Response(stats_data)
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching your stats."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserStatsByIdView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, deleted_at=None)
            listens = ListenedAt.objects(user=user).count()
            downloads = DownloadedAt.objects(user=user).count()
            data = {
                "user_id": str(user.id),
                "name": user.name,
                "total_listens": listens,
                "total_downloads": downloads,
            }
            return Response(data)
        except DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --- Xóa User --- (Optional)
class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, deleted_at=None)
            user.deleted_at = datetime.datetime.now()
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        try:
            total_users = User.objects(deleted_at=None).count()
            total_songs = Song.objects(deleted_at=None).count()
            total_listens = ListenedAt.objects.count()
            total_downloads = DownloadedAt.objects.count()

            stats_data = {
                "total_users": total_users,
                "total_songs": total_songs,
                "total_listens": total_listens,
                "total_downloads": total_downloads,
            }
            return Response(stats_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Ghi log lỗi ở đây nếu cần thiết
            print(f"Error fetching admin stats: {e}")
            return Response(
                {"error": "An error occurred while fetching statistics."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return User.objects()

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            object_id = ObjectId(lookup_value)
            return self.get_queryset().get(id=object_id)
        except Exception:
            raise NotFound("User not found or invalid ID format.")


class UserUpdateView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return User.objects

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            object_id = ObjectId(lookup_value)
            return self.get_queryset().get(id=object_id)
        except Exception:
            raise NotFound("User not found.")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            response_serializer = UserDetailSerializer(updated_user)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDeleteView(DestroyAPIView):
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return User.objects(deleted_at=None)

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            object_id = ObjectId(lookup_value)
            return self.get_queryset().get(id=object_id)
        except Exception:
            raise NotFound("User not found.")

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = datetime.datetime.now()
        instance.save()
        return Response(
            {"message": "User soft-deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q", "")
        result = User.search(query)
        serializer = UserCreationSerializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserSongHistoryView(APIView):
    """
    API view để lấy lịch sử nghe và tải bài hát của user đang đăng nhập.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user # User đã được xác thực
        
        user_object_id = None
        try:
            # Đảm bảo user.id (thường là string từ JWT) được chuyển thành ObjectId đúng cách
            user_object_id = ObjectId(str(user.id))
        except Exception as e:
            # Log lỗi này nếu cần thiết cho việc theo dõi phía server
            # print(f"ERROR: Could not convert user.id '{user.id}' to ObjectId: {e}")
            return Response({"song_history": [], "error": "Invalid user ID format in token"}, status=status.HTTP_400_BAD_REQUEST)

        # --- 1. Thống kê các bài hát đã NGHE ---
        pipeline_listened = [
            {'$match': {'user': user_object_id}}, 
            {'$group': {
                '_id': '$song', 
                'listen_count': {'$sum': 1}
            }},
            {'$project': { 
                'song_id': '$_id', 
                'listen_count': 1,
                '_id': 0 
            }},
            {'$sort': {'listen_count': -1}} 
        ]
        try:
            listened_songs_aggregation = list(ListenedAt.objects.aggregate(*pipeline_listened))
        except Exception as e:
            # Log lỗi aggregation nếu cần
            # print(f"ERROR: Aggregation for listened songs failed: {e}")
            listened_songs_aggregation = []


        # --- 2. Thống kê các bài hát đã TẢI ---
        pipeline_downloaded = [
            {'$match': {'user': user_object_id}},
            {'$group': {
                '_id': '$song',
                'download_count': {'$sum': 1}
            }},
            {'$project': {
                'song_id': '$_id',
                'download_count': 1,
                '_id': 0
            }},
            {'$sort': {'download_count': -1}}
        ]
        try:
            downloaded_songs_aggregation = list(DownloadedAt.objects.aggregate(*pipeline_downloaded))
        except Exception as e:
            # Log lỗi aggregation nếu cần
            # print(f"ERROR: Aggregation for downloaded songs failed: {e}")
            downloaded_songs_aggregation = []
        
        # --- 3. Tạo một map để tổng hợp thông tin ---
        song_interaction_map = {}

        for item in listened_songs_aggregation:
            # song_id từ aggregation là ObjectId, chuyển thành string để làm key trong dict Python
            song_id_str = str(item['song_id']) 
            if song_id_str not in song_interaction_map:
                # Lưu cả ObjectId gốc để query Song object sau này
                song_interaction_map[song_id_str] = {'listen_count': 0, 'download_count': 0, 'song_object_id': item['song_id']}
            song_interaction_map[song_id_str]['listen_count'] = item['listen_count']

        for item in downloaded_songs_aggregation:
            song_id_str = str(item['song_id'])
            if song_id_str not in song_interaction_map:
                song_interaction_map[song_id_str] = {'listen_count': 0, 'download_count': 0, 'song_object_id': item['song_id']}
            song_interaction_map[song_id_str]['download_count'] = item['download_count']
        
        # --- 4. Tạo kết quả cuối cùng ---
        final_song_history_list = []
        
        for song_id_str, counts_and_id_obj in song_interaction_map.items():
            song_object_id_from_map = counts_and_id_obj['song_object_id']
            try:
                # Fetch object Song hoàn chỉnh từ database bằng ObjectId đã lưu
                song_object = Song.objects.get(id=song_object_id_from_map)
                
                # Serialize object Song đó, truyền context request để tạo URL media
                serialized_song_data = EnhancedSongSerializer(song_object, context={'request': request}).data
                
                final_song_history_list.append({
                    'song': serialized_song_data,
                    'user_listen_count': counts_and_id_obj.get('listen_count', 0),
                    'user_download_count': counts_and_id_obj.get('download_count', 0)
                })
            except Song.DoesNotExist:
                # Ghi log nếu cần theo dõi bài hát không tìm thấy
                # print(f"WARNING: Song with ID {song_id_str} (ObjectId: {song_object_id_from_map}) not found in 'songs' collection. Skipping.")
                continue 
            except Exception as e:
                # Ghi log lỗi chi tiết nếu có vấn đề khi xử lý một bài hát
                # print(f"ERROR: Error processing song {song_id_str} (ObjectId: {song_object_id_from_map}): {e}")
                continue 

        return Response({"song_history": final_song_history_list}, status=status.HTTP_200_OK)