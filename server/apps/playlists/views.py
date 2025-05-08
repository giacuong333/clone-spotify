from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Playlist, PlaylistSong
from apps.songs.models import Song
from .serializers import PlaylistSerializer


class PlaylistListView(APIView):
    def get(self, request):
        # Truy vấn tất cả playlist từ MongoDB
        playlists = Playlist.objects()
        print("Playlists from MongoDB:", playlists)  # Log dữ liệu truy vấn
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)


class PlaylistCreateView(APIView):
    def post(self, request):
        data = request.data
        playlist = Playlist(
            user=data.get("user_id"),
            name=data.get("name"),
            cover_url=data.get("cover_url", ""),
            is_favorite=data.get("is_favorite", False),
            desc=data.get("desc", ""),
        )
        playlist.save()
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PlaylistUpdateView(APIView):
    def put(self, request, pk):
        try:
            playlist = Playlist.objects.get(id=pk)
            data = request.data
            playlist.name = data.get("name", playlist.name)
            playlist.cover_url = data.get("cover_url", playlist.cover_url)
            playlist.is_favorite = data.get("is_favorite", playlist.is_favorite)
            playlist.desc = data.get("desc", playlist.desc)
            playlist.save()
            serializer = PlaylistSerializer(playlist)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )


class PlaylistDeleteView(APIView):
    def delete(self, request, pk):
        try:
            playlist = Playlist.objects.get(id=pk)
            playlist.delete()
            return Response(
                {"message": "Playlist deleted successfully"}, status=status.HTTP_200_OK
            )
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )


class AddSongToPlaylistView(APIView):
    def post(self, request, pk):
        try:
            playlist = Playlist.objects.get(id=pk)
            song_id = request.data.get("song_id")
            song = Song.objects.get(id=song_id)
            playlist_song = PlaylistSong(song=song)
            playlist.songs.append(playlist_song)
            playlist.save()
            return Response(
                {"message": "Song added to playlist"}, status=status.HTTP_200_OK
            )
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Song.DoesNotExist:
            return Response(
                {"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND
            )
