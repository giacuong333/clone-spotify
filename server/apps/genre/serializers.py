from rest_framework import serializers
from .models import Genre
from mongoengine import StringField


class GenreSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
