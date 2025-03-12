from auths.models import Auth
from rest_framework import serializers

class AuthSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self):
        return