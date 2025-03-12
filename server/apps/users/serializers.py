from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        # if User.get_by_username(data['username']):
        #     raise serializers.ValidationError(
        #         {'message': 'Username was registered!'}
        #     )
            
        if User.get_by_email(data['email']):
            raise serializers.ValidationError(
                {'message': 'Email was registered!'}
            )
        
        return data
            
    def create(self, validated_data):
        user = User(**validated_data)
        user_id = user.create()
        return {'_id': user_id, **validated_data}
    
    def update(self, instance, validated_data):
        pass