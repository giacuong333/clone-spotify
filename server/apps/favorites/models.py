from django.db import models
# from apps.users.models import User
from apps.songs.models import Song

class Favorite(models.Model):
    # user = models.ForeignKey(User, on_delete=models.SET_NULL)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_created=True)
    
    class Meta:
        db_table = 'favorites'