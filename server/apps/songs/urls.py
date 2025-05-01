from django.urls import path
from .views import Find, Create, Update, Delete

urlpatterns = [
    path("", Find.as_view(), name="find_all"),
    path("<str:song_id>/", Find.as_view(), name="find_by_id"),
    path("create/", Create.as_view(), name="create"),
    path("<str:song_id>/update/", Update.as_view(), name="update"),
    path("<str:song_id>/delete/", Delete.as_view(), name="delete"),
]
