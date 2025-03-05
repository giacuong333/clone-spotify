from django.db import models
from apps.artists.models import Artist

class Album(models.Model):
    name = models.CharField(max_length=100)
    cover_url = models.TextField()
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    songs = models.JSONField(default=list)
    release_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'albums'