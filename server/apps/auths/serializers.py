from auths.models import Auth
from rest_framework import serializers, viewsets

class AuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auth
        fields = ['email', 'password']
    
    def create(self, validated_data):
        return
    
    def update(self, instance, validated_data):
        return
    
    def validate(self):
        return