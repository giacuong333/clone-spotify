from rest_framework import serializers
from .models import Playlist, PlaylistSong
import datetime


class PlaylistSongSerializer(serializers.Serializer):
    song = serializers.CharField(source="song.id", required=False)  # Không bắt buộc
    added_at = serializers.DateTimeField(required=False)  # Không bắt buộc


class PlaylistSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # Ánh xạ _id thành id
    user = serializers.CharField(source="user.id", read_only=True)
    name = serializers.CharField(required=True)
    cover_url = serializers.CharField(required=False, allow_blank=True)
    is_favorite = serializers.CharField(required=False, allow_blank=True)
    desc = serializers.CharField(required=False, allow_blank=True)
    songs = PlaylistSongSerializer(many=True, required=False)  # Không bắt buộc
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        request = self.context.get("request")  # Lấy request từ context
        user = request.user  # Lấy thông tin người dùng đang đăng nhập

        # Gán user vào playlist
        validated_data["user"] = user

        songs_data = validated_data.pop("songs", [])
        playlist = Playlist(**validated_data)
        try:
            playlist.save()
            print("Playlist saved:", playlist.id)  # Log ID của playlist
        except Exception as e:
            print("Error saving playlist:", e)  # Log lỗi nếu xảy ra
        for song_data in songs_data:
            playlist.songs.append(PlaylistSong(**song_data))
        playlist.save()
        return playlist

    def update(self, instance, validated_data):
        # Cập nhật các trường của playlist
        instance.name = validated_data.get("name", instance.name)
        instance.cover_url = validated_data.get("cover_url", instance.cover_url)
        instance.is_favorite = validated_data.get("is_favorite", instance.is_favorite)
        instance.desc = validated_data.get("desc", instance.desc)

        # Cập nhật danh sách bài hát nếu có
        songs_data = validated_data.get("songs", [])
        if songs_data:
            instance.songs = [PlaylistSong(**song_data) for song_data in songs_data]

        instance.updated_at = datetime.datetime.now()  # Cập nhật thời gian
        instance.save()
        return instance
