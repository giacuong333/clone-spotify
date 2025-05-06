from django.urls import path
from .views import (
    SongListView,
    SongDetailView,
    SongCreateView,
    SongBulkDestroyView,
    SongFileView,
    SongCoverView,
)

urlpatterns = [
    path("create/", SongCreateView.as_view(), name="song_create"),
    path("", SongListView.as_view(), name="song_list"),
    path("<str:song_id>/", SongDetailView.as_view(), name="song_detail"),
    path("delete/", SongBulkDestroyView.as_view(), name="song_delete"),
    path("<str:song_id>/audio", SongFileView.as_view(), name="song_audio"),
    path("<str:song_id>/cover", SongCoverView.as_view(), name="song_cover"),
]
