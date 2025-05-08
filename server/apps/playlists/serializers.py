from rest_framework import serializers
from .models import Playlist, PlaylistSong
from apps.songs.models import Song
from django.contrib.auth.models import User  # Import User model

class PlaylistSongSerializer(serializers.Serializer):
    song_id = serializers.CharField(source="song.id", read_only=True)  # Lấy ID từ trường `song`
    added_at = serializers.DateTimeField()


class PlaylistSerializer(serializers.Serializer):
    id = serializers.CharField(source="_id", read_only=True)  # ID của playlist
    user = serializers.CharField(source="user.id", read_only=True)  # User tham chiếu
    name = serializers.CharField(required=True)  # Tên playlist
    cover_url = serializers.CharField(required=False, allow_blank=True)  # URL ảnh bìa
    is_favorite = serializers.SerializerMethodField()  # Boolean
    desc = serializers.CharField(required=False, allow_blank=True)  # Mô tả
    songs = PlaylistSongSerializer(many=True, read_only=True)  # Danh sách bài hát
    created_at = serializers.DateTimeField(read_only=True)  # Ngày giờ tạo
    updated_at = serializers.DateTimeField(read_only=True)  # Ngày giờ cập nhật

    def get_is_favorite(self, obj):
        # Trả về giá trị boolean trực tiếp
        return obj.is_favorite