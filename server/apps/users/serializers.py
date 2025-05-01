from rest_framework.serializers import (
    Serializer,
    CharField,
    EmailField,
    ValidationError,
)
from .models import User


class UserSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField(required=True)
    email = EmailField(required=True)
    password = CharField(required=True, write_only=True)

    def validate(self, data):
        if User.get_by_email(data["email"]):
            raise ValidationError({"message": "Email was registered!"})

        return data

    def create(self, validated_data):
        for key, value in validated_data.items():
            print(f"Key: {key} - Value: {value}")
        user_id = User.create(**validated_data)
        return {"_id": str(user_id)}
