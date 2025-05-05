<<<<<<< HEAD
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import User


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
=======
# server/apps/users/serializers.py
from rest_framework.serializers import (
    Serializer,
    CharField,
    EmailField,
    ValidationError,
)
from .models import User

class UserCreationSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField(required=True, max_length=100)
    email = EmailField(required=True)
    password = CharField(required=True, write_only=True, min_length=8) # Thêm write_only và min_length
>>>>>>> origin/khiem

    def validate_email(self, value):

        if User.objects(email=value).first():
            raise ValidationError("Email already registered!")
        return value

    def create(self, validated_data):
<<<<<<< HEAD
        for key, value in validated_data.items():
            print(f"Key: {key} - Value: {value}")
        user_id = User.create(**validated_data)
        return {"_id": str(user_id)}


class UserListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True, source="pk")
    name = serializers.CharField(read_only=True)


class UserRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        user = User.create(validated_data)
        if isinstance(user, ValueError):
            raise serializers.ValidationError({"message": str(user)})
        return {"_id": str(user.id)}
=======

        # from utils.hash_and_verify_password import hash_password
        # validated_data['password'] = hash_password(validated_data['password'])

        user = User(**validated_data)
        user.save()
        return user


class UserDisplaySerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField(read_only=True)
    email = EmailField(read_only=True)
    role = CharField(read_only=True)
    bio = CharField(read_only=True, required=False)
    image_url = CharField(read_only=True, required=False)
    created_at = CharField(read_only=True) 
    updated_at = CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'bio', 'image_url', 'created_at', 'updated_at']
        read_only_fields = fields # Đảm bảo tất cả đều chỉ đọc



class UserProfileUpdateSerializer(Serializer):
    name = CharField(required=False, max_length=100)
    # password = CharField(required=False, write_only=True, min_length=8) # User có thể đổi pass
    bio = CharField(required=False, allow_blank=True)
    image_url = CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        # if 'password' in validated_data:
            # instance.password = hash_password(validated_data['password']) # Hash password mới
        instance.bio = validated_data.get('bio', instance.bio)
        instance.image_url = validated_data.get('image_url', instance.image_url)
        instance.updated_at = datetime.datetime.now() # Cập nhật thời gian
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ['name', 'bio', 'image_url']
>>>>>>> origin/khiem
