from django.urls import path
from .views import (
    PlaylistListView,
    PlaylistCreateView,
    PlaylistUpdateView,
    PlaylistDeleteView,
    AddSongToPlaylistView,
)

urlpatterns = [
    path('', PlaylistListView.as_view(), name='playlist_list'),  # GET
    path('create/', PlaylistCreateView.as_view(), name='playlist_create'),  # POST
    path('<str:pk>/update/', PlaylistUpdateView.as_view(), name='playlist_update'),  # PUT
    path('<str:pk>/delete/', PlaylistDeleteView.as_view(), name='playlist_delete'),  # DELETE
    path('<str:pk>/add-song/', AddSongToPlaylistView.as_view(), name='add_song_to_playlist'),  # Add song
]
 