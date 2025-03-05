from django.db import models
# from apps.users.models import User
from apps.songs.models import Song

class History(models.Model):
    # user = models.ForeignKey(User, on_delete=models.SET_NULL)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    played_at = models.DateTimeField()

    class Meta:
        db_table = 'histories'