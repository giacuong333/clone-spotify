from django.urls import path
from .views import (
    PlaylistListView,
    PlaylistCreateView,
    PlaylistDetailView,
    PlaylistUpdateView,
    PlaylistDeleteView,
    AddSongToPlaylistView,
)

urlpatterns = [
    path("", PlaylistListView.as_view(), name="playlist-list"),
    path("create/", PlaylistCreateView.as_view(), name="playlist-create"),
    path("<str:pk>/", PlaylistDetailView.as_view(), name="playlist-detail"),
    path("<str:pk>/update/", PlaylistUpdateView.as_view(), name="playlist-update"),
    path("<str:pk>/delete/", PlaylistDeleteView.as_view(), name="playlist-delete"),
    path(
        "<str:playlist_id>/add-song/",
        AddSongToPlaylistView.as_view(),
        name="add-song-to-playlist",
    ),
]
