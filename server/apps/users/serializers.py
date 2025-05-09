from rest_framework import serializers
from utils.hash_and_verify_password import hash_password
from .models import User
from datetime import datetime
from rest_framework.exceptions import ValidationError, NotFound
from .models import User
from apps.songs.models import Song
import datetime
from bson import ObjectId
import base64

from apps.songs.serializers import EnhancedSongSerializer



class UserCreationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(required=True, max_length=100)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True, write_only=True, min_length=8
    )  # Thêm write_only và min_length

    def validate_email(self, value):

        if User.objects(email=value).first():
            raise serializers.ValidationError("Email already registered!")
        return value

    def create(self, validated_data):
        for key, value in validated_data.items():
            print(f"Key: {key} - Value: {value}")
        user_id = User.create(**validated_data)
        return {"_id": str(user_id)}


class UserListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True, source="pk")
    name = serializers.CharField(read_only=True)
    email = serializers.CharField()
    image = serializers.SerializerMethodField(allow_null=True, read_only=True)

    def get_image(self, obj):
        try:
            if obj.image and hasattr(obj.image, "grid_id"):
                grid_file = obj.image.grid_id
                content = obj.image.read()
                base64_data = base64.b64encode(content).decode("utf-8")
                return f"data:image/jpeg;base64,{base64_data}"
        except Exception as e:
            print("Error reading image from GridFS:", e)
        return None


# class UserRegisterSerializer(serializers.Serializer):
#     name = serializers.CharField(write_only=True, required=True)
#     email = serializers.EmailField(write_only=True, required=True)
#     password = serializers.CharField(write_only=True, required=True)

#     def create(self, validated_data):
#         user = User.create(validated_data)
#         if isinstance(user, ValueError):
#             raise serializers.ValidationError({"message": str(user)})
#             return {"_id": str(user.id)}

#         # from utils.hash_and_verify_password import hash_password
#         # validated_data['password'] = hash_password(validated_data['password'])

#         user = User(**validated_data)
#         user.save()
#         return user


class UserDisplaySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    role = serializers.CharField(read_only=True)
    bio = serializers.CharField(read_only=True, required=False)
    image = serializers.CharField(read_only=True, required=False)
    created_at = serializers.CharField(read_only=True)
    updated_at = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "role",
            "bio",
            "image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields  # Đảm bảo tất cả đều chỉ đọc


class UserProfileUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, max_length=100)
    # password = CharField(required=False, write_only=True, min_length=8) # User có thể đổi pass
    bio = serializers.CharField(required=False, allow_blank=True)
    image = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        # if 'password' in validated_data:
        # instance.password = hash_password(validated_data['password']) # Hash password mới
        instance.bio = validated_data.get("bio", instance.bio)
        instance.image = validated_data.get("image", instance.image)
        instance.updated_at = datetime.now()  # Cập nhật thời gian
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ["name", "bio", "image"]


class UserDetailSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    bio = serializers.CharField(allow_blank=True, read_only=True)
    role = serializers.ChoiceField(choices=["admin", "user"], read_only=True)
    image = serializers.SerializerMethodField(allow_null=True, read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    deleted_at = serializers.DateTimeField(allow_null=True, read_only=True)

    def get_image(self, obj):
        try:
            if obj.image and hasattr(obj.image, "grid_id"):
                grid_file = obj.image.grid_id
                content = obj.image.read()
                base64_data = base64.b64encode(content).decode("utf-8")
                return f"data:image/jpeg;base64,{base64_data}"
        except Exception as e:
            print("Error reading image from GridFS:", e)
        return None

    # songs = serializers.SerializerMethodField()

    # def get_songs(self, obj):
    #     from apps.songs.serializers import EnhancedSongSerializer

    #     user_songs = Song.objects.filter(user=obj)
    #     return EnhancedSongSerializer(user_songs, many=True).data


class UserUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    bio = serializers.CharField(required=False, allow_blank=True)
    image = serializers.FileField(required=False, allow_null=True)
    password = serializers.CharField(required=False, write_only=True, min_length=8)

    def update(self, instance, validated_data):
        image = validated_data.get("image", None)
        if image is not None:
            instance.image = image

        for field in ["name", "bio"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        password = validated_data.get("password")
        if password:
            instance.password = hash_password(password)

        instance.updated_at = datetime.datetime.now()
        instance.save()
        return instance

class UserSongInteractionSerializer(serializers.Serializer):
    song = EnhancedSongSerializer() # Hoặc chỉ các trường cần thiết của Song
    listen_count = serializers.IntegerField(default=0)
    download_count = serializers.IntegerField(default=0)

    class Meta:
        fields = ['song', 'listen_count', 'download_count']