from rest_framework import serializers
from mongoengine import DoesNotExist
from apps.users.serializers import UserCreationSerializer
from apps.songs.serializers import EnhancedSongSerializer


class SongsOfPlaylistSerializer(serializers.Serializer):
    song = serializers.SerializerMethodField()
    added_at = serializers.DateTimeField()

    def get_song(self, obj):
        try:
            if not obj.song:
                return None
            return EnhancedSongSerializer(obj.song).data
        except DoesNotExist:
            return None


class PlaylistSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user = serializers.SerializerMethodField()
    name = serializers.CharField()
    cover = serializers.CharField(allow_null=True)
    is_favorite = serializers.BooleanField()
    desc = serializers.CharField(allow_null=True)
    songs = SongsOfPlaylistSerializer(many=True)
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()

    def get_user(self, obj):
        try:
            if not obj.user:
                return None
            return UserCreationSerializer(obj.user).data
        except DoesNotExist:
            return None
