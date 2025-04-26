from rest_framework.serializers import (
    Serializer,
    CharField,
    DateTimeField,
    IntegerField,
)
from .models import Song
from apps.genre.serializers import GenreSerializer
from apps.users.serializers import UserSerializer


class SongSerializer(Serializer):
    id = CharField(read_only=True)
    title = CharField(required=True)
    genre = GenreSerializer(many=True, read_only=True)
    file_url = CharField(allow_blank=True, required=False)
    cover_url = CharField(allow_blank=True, required=False)
    user = UserSerializer(read_only=True)
    duration = IntegerField(required=True)
    released_at = DateTimeField(required=False)
    approved_at = DateTimeField(required=False)
    deleted_at = DateTimeField(required=False)

    def validate(self, data):
        pass

    def create(self, validated_data):
        return Song.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        return instance
