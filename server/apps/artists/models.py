from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    image_url = models.TextField()
    
    # Collection name in MongoDB
    class Meta:
        db_table = 'artist'
        