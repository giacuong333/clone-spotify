from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        if User.get_by_email(data['email']):
            raise serializers.ValidationError(
                {'message': 'Email was registered!'}
            )
        
        return data
            
    def create(self, validated_data):
        for key, value in validated_data.items():
            print(f"Key: {key} - Value: {value}")
        user_id = User.create(**validated_data)
        return {'_id': str(user_id)}