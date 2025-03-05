from django.db import models
from apps.artists.models import Artist
from apps.albums.models import Album

class Song(models.Model):
    title = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    genre = models.CharField(max_length=100)
    file_url = models.TextField()
    image_url = models.TextField()
    release_date = models.DateField()
    is_proved = models.BooleanField()
    
    class Meta:
        db_table = 'songs'