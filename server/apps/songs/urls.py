from django.urls import path
from .views import (
    SongListView,
    SongDetailView,
    SongCreateView,
    SongBulkDestroyView,
    SongFileView,
    SongCoverView,
    SongSearchView,
    SongVideoView,
)

urlpatterns = [
    path("create/", SongCreateView.as_view(), name="song-create"),
    path("", SongListView.as_view(), name="song-list"),
    path("search/", SongSearchView.as_view(), name="song-search"),
    path("<str:song_id>/", SongDetailView.as_view(), name="song-detail"),
    path("delete/", SongBulkDestroyView.as_view(), name="song-delete"),
    path("<str:song_id>/audio", SongFileView.as_view(), name="song-audio"),
    path("<str:song_id>/video", SongVideoView.as_view(), name="song-video"),
    path("<str:song_id>/cover", SongCoverView.as_view(), name="song-cover"),
]
