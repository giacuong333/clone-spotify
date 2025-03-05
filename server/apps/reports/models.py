from django.db import models
from apps.users.models import User
from apps.songs.models import Song

class Report(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    reason = models.TextField()
    description = models.TextField()
    status =  models.CharField(max_length=50)
    reviewd_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'reports'