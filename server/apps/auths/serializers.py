from .models import Auth
from apps.users.models import User
from rest_framework import serializers
from utils.hash_and_verify_password import verify_password

class AuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        authenticator = Auth(data.get('email'), data.get('password'))
        
        user = User.get_by_email(authenticator.email)
        if not user:
            raise serializers.ValidationError(
                {'message': 'Account does not exist!'}
            )
            
        if not verify_password(authenticator.password, user['password']):
            raise serializers.ValidationError(
                {'message': 'Password is incorrect!'}
            )
            
        return authenticator.login()