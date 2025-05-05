from rest_framework import serializers
from rest_framework.exceptions import ValidationError, NotFound
from .models import User
from apps.songs.models import Song
import datetime
from bson import ObjectId


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if User.get_by_email(data["email"]):
            raise ValidationError({"message": "Email was registered!"})

        return data

    def create(self, validated_data):
        for key, value in validated_data.items():
            print(f"Key: {key} - Value: {value}")
        user_id = User.create(**validated_data)
        return {"_id": str(user_id)}


class UserListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True, source="pk")
    name = serializers.CharField(read_only=True)


class UserDetailSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    bio = serializers.CharField(allow_blank=True, read_only=True)
    role = serializers.ChoiceField(choices=["admin", "user"], read_only=True)
    image = serializers.FileField(allow_null=True, read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    deleted_at = serializers.DateTimeField(allow_null=True, read_only=True)

    # songs = serializers.SerializerMethodField()

    # def get_songs(self, obj):
    #     from apps.songs.serializers import EnhancedSongSerializer

    #     user_songs = Song.objects.filter(user=obj)
    #     return EnhancedSongSerializer(user_songs, many=True).data


class UserUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    bio = serializers.CharField(required=False, allow_blank=True)
    image = serializers.FileField(required=False, allow_null=True)

    def update(self, instance, validated_data):
        if "image" in validated_data:
            setattr(instance, "image", validated_data["image"])

        for field in ["name", "bio"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.updated_at = datetime.datetime.now()
        instance.save()
        return instance
