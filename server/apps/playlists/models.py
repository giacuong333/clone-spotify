from django.db import models
from apps.users.models import User

class Playlist(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    songs = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_created=True)
    
    class Meta:
        db_table = 'playlists'