from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def create(self, validated_data):
        user = User(**validated_data)
        user_id = user.create()
        return {'_id': user_id, **validated_data}