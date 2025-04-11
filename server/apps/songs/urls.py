from django.urls import path
from .views import GetAllSongs

urlpatterns = [
    path("get", GetAllSongs.as_view(), name='get'),
]
 