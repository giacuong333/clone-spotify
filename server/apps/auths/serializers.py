from .models import Auth
from apps.users.models import User
from rest_framework import serializers
from utils.hash_and_verify_password import verify_password

class AuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        user_dict = User.get_by_email(email)
        if not user_dict:
            raise serializers.ValidationError(
                {'message': 'Account does not exist!'}
            )
            
        if not verify_password(password, user_dict['password']):
            raise serializers.ValidationError(
                {'message': 'Password is incorrect!'}
            )
        
        tokens = Auth.generate_tokens(user_dict)
        return tokens