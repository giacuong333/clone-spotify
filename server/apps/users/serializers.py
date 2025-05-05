from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import User


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


class UserRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        user = User.create(validated_data)
        if isinstance(user, ValueError):
            raise serializers.ValidationError({"message": str(user)})
        return {"_id": str(user.id)}
