from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Playlist, SongsOfPlaylist
from apps.songs.models import Song
from .serializers import PlaylistSerializer


class GetAllView(APIView):

    def get(self, request):
        user = request.user
        role = user.role
        user_id = user.id

        if role == "admin":
            return Response("This is admin", status=status.HTTP_403_FORBIDDEN)

        playlists = Playlist.findAll(user_id)
        if not playlists:
            return Response([], status=status.HTTP_200_OK)

        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        playlist_id = request.GET.get("playlist_id", "")
        role = user.role

        if role == "admin":
            return Response("This is admin", status=status.HTTP_403_FORBIDDEN)

        playlist = Playlist.findById(playlist_id)
        if not playlist:
            return Response("Playlist not found", status=status.HTTP_404_NOT_FOUND)

        serializer = PlaylistSerializer(playlist, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddSongToPlayListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        song_id = request.data.get("song_id", "")
        playlist_id = request.data.get("playlist_id", "")
        user = request.user

        if user["role"] != "user":
            return Response("This is admin", status=status.HTTP_403_FORBIDDEN)

        if not song_id:
            return Response("Song ID is required", status=status.HTTP_400_BAD_REQUEST)

        song = Song.findById(song_id)
        if not song:
            return Response("Song not found", status=status.HTTP_404_NOT_FOUND)

        # Nếu nhấn vào nút + ở NowPlayingBar -> Tạo playlist mới với tên của playlist là tên của bài hát
        if not playlist_id:
            song_entry = SongsOfPlaylist(song=song)
            data = {
                "user": user,
                "name": song.title,
                "desc": f"Playlist - {user.name}",
                "songs": [song_entry],
            }
            added_playlist = Playlist.create(data)
            if not added_playlist:
                return Response("Create failed", status=status.HTTP_404_NOT_FOUND)
            return Response("Created", status=status.HTTP_201_CREATED)

        # Nếu người dùng chọn playlist để thêm nhạc vào
        playlist = Playlist.findById(playlist_id)
        if not playlist or playlist.user != user:
            return Response(
                "Playlist not found or unauthorized", status=status.HTTP_404_NOT_FOUND
            )

        added_playlist = Playlist.addSongToPlayList(playlist_id, song_id)
        if not added_playlist:
            return Response(
                "Song or Playlist not found", status=status.HTTP_404_NOT_FOUND
            )
        return Response("Song added", status=status.HTTP_201_CREATED)


class RemoveSongFromPlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        playlist_id = request.data.get("playlist_id", "")
        song_id = request.data.get("song_id", "")

        if not playlist_id:
            return Response(
                "Playlist ID is required", status=status.HTTP_400_BAD_REQUEST
            )
        playlist = Playlist.findById(playlist_id)
        if not playlist:
            return Response("Playlist not found", status=status.HTTP_404_NOT_FOUND)

        if not song_id:
            return Response("Song ID is required", status=status.HTTP_400_BAD_REQUEST)
        song = Song.findById(song_id)
        if not song:
            return Response("Song not found", status=status.HTTP_404_NOT_FOUND)

        Playlist.removeSongFromPlayList(playlist_id, song_id)

        return Response("Removed", status=status.HTTP_204_NO_CONTENT)


class EditPlaylistView(APIView):
    permission_classes = [IsAuthenticated]
    pass


class DeletePlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        playlist_id = request.GET.get("playlist_id", "")

        if not playlist_id:
            return Response(
                "Playlist ID is required", status=status.HTTP_400_BAD_REQUEST
            )
        playlist = Playlist.findById(playlist_id)
        if not playlist:
            return Response("Playlist not found", status=status.HTTP_404_NOT_FOUND)

        is_deleted = Playlist.delete(playlist_id)

        if is_deleted == False:
            return Response(
                "Delete failed", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response("Deleted", status=status.HTTP_204_NO_CONTENT)


class CreatePlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get("name", "")
        desc = request.data.get("desc", "")
        user = request.user

        if not desc:
            desc = f"Playlist - {user.name}"

        data = {"user": user, "name": name, "desc": desc}

        created_playlist = Playlist.create(data)
        if not created_playlist:
            return Response(
                "Create failed", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response("Created", status=status.HTTP_201_CREATED)


class GetPlaylistsByUserIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get("user_id", None).strip("/")

        if not user_id:
            return Response("User ID is required", status=status.HTTP_400_BAD_REQUEST)

        # Lấy tất cả playlist của user_id
        playlists = Playlist.findAll(user_id)
        if playlists is None:
            return Response(
                "No playlists found for this user", status=status.HTTP_404_NOT_FOUND
            )

        # Serialize data và trả về
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
