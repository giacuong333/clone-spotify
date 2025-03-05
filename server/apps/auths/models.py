from django.db import models

class Auth(models.Model): 
    
    class Meta:
        abstract = True
        
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
