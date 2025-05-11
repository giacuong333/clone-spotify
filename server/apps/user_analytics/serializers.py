from rest_framework import serializers
from apps.songs.serializers import SongSerializer

# Serializers cho danh sách nhạc đã nghe của người dùng
class RecentlyPlayedSerializer(serializers.Serializer):
    song = SongSerializer()
    last_listened_at = serializers.DateTimeField()

# Serializers cho danh sách nhạc đã update của người dùng (Ca sĩ)
class UserUploadedSongsSerializer(serializers.Serializer):
    song = SongSerializer()
    play_count = serializers.IntegerField()
    download_count = serializers.IntegerField()

# Serializers cho thể loại nhạc đã nghe của người dùng
class UserGenreStatSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    song_count = serializers.IntegerField()
    play_count = serializers.IntegerField()
    percentage = serializers.FloatField()
