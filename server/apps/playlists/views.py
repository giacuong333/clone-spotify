from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Playlist, PlaylistSong
from .serializers import PlaylistSerializer
from .models import Song

class PlaylistListView(APIView):
    def get(self, request):
        playlists = Playlist.objects.all()
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlaylistCreateView(APIView):
    def post(self, request):
        serializer = PlaylistSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            playlist = serializer.save()
            return Response(
                PlaylistSerializer(playlist).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaylistDetailView(APIView):
    def get(self, request, pk):
        try:
            playlist = Playlist.objects.get(pk=pk)
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlaylistUpdateView(APIView):
    def put(self, request, pk):
        try:
            playlist = Playlist.objects.get(pk=pk)
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaylistDeleteView(APIView):
    def delete(self, request, pk):
        try:
            playlist = Playlist.objects.get(pk=pk)
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )
        playlist.delete()
        return Response(
            {"message": "Playlist deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class AddSongToPlaylistView(APIView):
    def post(self, request, playlist_id):
        try:
            # Lấy playlist
            playlist = Playlist.objects.get(pk=playlist_id)

            # Lấy song_id từ request
            song_id = request.data.get("song_id")
            if not song_id:
                return Response({"error": "song_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Lấy bài hát từ cơ sở dữ liệu
            try:
                song = Song.objects.get(pk=song_id)
            except Song.DoesNotExist:
                return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)

            # Kiểm tra xem bài hát đã tồn tại trong playlist chưa
            for playlist_song in playlist.songs:
                if playlist_song.song == song:
                    return Response({"message": "Song already in playlist"}, status=status.HTTP_200_OK)

            # Tạo đối tượng PlaylistSong
            playlist_song = PlaylistSong(song=song)

            # Thêm bài hát vào playlist
            playlist.songs.append(playlist_song)
            playlist.save()

            return Response(
                {"message": "Song added to playlist successfully"},
                status=status.HTTP_200_OK,
            )
        except Playlist.DoesNotExist:
            return Response(
                {"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
