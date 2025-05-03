from django.urls import path
from .views import SongListView, SongDetailView, SongCreateView, SongDeleteView, SongFileView, SongCoverView

urlpatterns = [
    path("create/", SongCreateView.as_view(), name="song-create"),
    path("", SongListView.as_view(), name="song-list"),
    path("<str:song_id>/", SongDetailView.as_view(), name="song-detail"),
    path("delete/", SongDeleteView.as_view(), name="song-delete"),
    path("<str:song_id>/audio", SongFileView.as_view(), name="song-audio"),
    path("<str:song_id>/cover", SongCoverView.as_view(), name="song-cover"),
]