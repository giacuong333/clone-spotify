from rest_framework import serializers


class SongStatSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    artist_name = serializers.CharField()
    album_name = serializers.CharField(allow_null=True, required=False)
    play_count = serializers.IntegerField()
    download_count = serializers.IntegerField()


class GenreStatSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    song_count = serializers.IntegerField()
    play_count = serializers.IntegerField()


class HourlyStatSerializer(serializers.Serializer):
    hour = serializers.IntegerField()
    play_count = serializers.IntegerField()
