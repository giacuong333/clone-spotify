from rest_framework import serializers
from .models import Song
from apps.genre.serializers import GenreSerializer
from apps.users.serializers import UserListSerializer
from bson import ObjectId
from mongoengine.errors import DoesNotExist
from datetime import datetime


class SongSerializer(serializers.Serializer):
    """Base serializer for Song model that includes all fields from the model"""

    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    genre = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    duration = serializers.IntegerField()
    released_at = serializers.DateTimeField()
    deleted_at = serializers.DateTimeField(
        read_only=True, required=False, allow_null=True
    )

    def get_genre(self, obj):
        """Get serialized genre data"""
        if not obj.genre:
            return []
        return GenreSerializer(obj.genre, many=True).data

    def get_user(self, obj):
        """Get serialized user data"""
        if not obj.user:
            return None
        return UserListSerializer(obj.user).data


class EnhancedSongSerializer(SongSerializer):
    """Enhanced serializer that includes audio and cover URLs"""

    audio_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()

    def get_audio_url(self, obj):
        """Generate URL for streaming the audio file"""
        request = self.context.get("request")
        # Check if audio exists and has grid_id (important for GridFS)
        if request and obj.audio and hasattr(obj.audio, "grid_id"):
            base_url = request.build_absolute_uri("/").rstrip("/")
            return f"{base_url}/api/songs/{obj.id}/audio"
        return None

    def get_cover_url(self, obj):
        """Generate URL for retrieving the cover image"""
        request = self.context.get("request")
        # Check if cover exists and has grid_id (important for GridFS)
        if request and obj.cover and hasattr(obj.cover, "grid_id"):
            base_url = request.build_absolute_uri("/").rstrip("/")
            return f"{base_url}/api/songs/{obj.id}/cover"
        return None


# If you want to also handle file uploads in this serializer, you'd need to add create/update methods
# Here's a sketch of how that might look:


class SongCreateSerializer(serializers.Serializer):
    """Serializer for creating songs with file uploads"""

    title = serializers.CharField()
    genre_ids = serializers.ListField(child=serializers.CharField(), required=False)
    audio = serializers.FileField()
    cover = serializers.FileField(required=False)
    duration = serializers.IntegerField()
    released_at = serializers.DateTimeField(required=False)
    deleted_at = serializers.DateTimeField(
        required=False, allow_null=True, default=None
    )

    def create(self, validated_data):
        from apps.genre.models import Genre

        # Extract genre_ids and remove from validated_data
        genre_ids = validated_data.pop("genre_ids", [])

        # If genre_ids is a single string, split it
        if genre_ids and isinstance(genre_ids, str):
            genre_ids = genre_ids.split(",")
        elif (
            genre_ids
            and isinstance(genre_ids, list)
            and len(genre_ids) == 1
            and "," in genre_ids[0]
        ):
            genre_ids = genre_ids[0].split(",")

        # Get genres from ids
        genres = []
        for genre_id in genre_ids:
            try:
                # Validate ObjectId
                ObjectId(genre_id)  # Raises InvalidId if invalid
                genre = Genre.objects.get(id=genre_id)
                genres.append(genre)
            except (DoesNotExist, ValueError):
                continue  # Skip invalid or non-existent genres

        # Add genres to data
        validated_data["genre"] = genres

        # Add released_at
        validated_data["released_at"] = datetime.now()

        # Add deleted_at null
        validated_data["deleted_at"] = validated_data.get("deleted_at", None)

        # Get user from request context
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data["user"] = request.user
        else:  # This line for testing
            validated_data["user"] = ObjectId("6807559e081908b550ef9a3d")

        # Create the song
        return Song.create(validated_data)
