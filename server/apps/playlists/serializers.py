import base64
from mongoengine import DoesNotExist
from rest_framework import serializers
from apps.users.serializers import UserCreationSerializer


class SongsOfPlaylistSerializer(serializers.Serializer):
    song = serializers.SerializerMethodField()
    added_at = serializers.DateTimeField()

    def get_song(self, obj):
        try:
            if not obj.song:
                return None
            from apps.songs.serializers import EnhancedSongSerializer
            return EnhancedSongSerializer(obj.song, context=self.context).data
        except DoesNotExist:
            return None


class PlaylistSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user = serializers.SerializerMethodField()
    name = serializers.CharField()
    cover = serializers.SerializerMethodField(allow_null=True)
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

    def get_cover(self, obj):
        try:
            if obj.cover and hasattr(obj.cover, "grid_id"):
                content = obj.cover.read()
                content_type = getattr(obj.cover, "content_type", "image/jpeg")
                base64_data = base64.b64encode(content).decode("utf-8")
                return f"data:{content_type};base64,{base64_data}"
        except Exception as e:
            print("Error reading image from GridFS:", e)
        return None
