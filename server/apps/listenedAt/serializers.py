from rest_framework import serializers
from apps.songs.serializers import SongSerializer
from .models import Song
from apps.genre.serializers import GenreSerializer
from apps.users.serializers import UserDetailSerializer
from bson import ObjectId
from mongoengine.errors import DoesNotExist
from datetime import datetime


class ListenedAtSerializer(serializers.Serializer):
    """Base serializer for ListenedAt model that includes all fields from the model"""

    id = serializers.CharField(read_only=True)
    song = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    listened_at = serializers.DateTimeField()

    def get_song(self, obj):
        """Get serialized song data"""
        if not obj.song:
            return None
        return SongSerializer(obj.song).data

    def get_user(self, obj):
        """Get serialized user data, handle missing/invalid user reference"""
        try:
            if not obj.user:
                return None
            return UserDetailSerializer(obj.user).data
        except DoesNotExist:
            return None
