from django.db import models
from apps.favorites.models import Favorite
from apps.histories.models import History

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    favorite = models.ForeignKey(Favorite, on_delete=models.CASCADE)
    history = models.ForeignKey(History, on_delete=models.CASCADE)
    isPremium = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'users'