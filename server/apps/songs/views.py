from django.http import HttpResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from gridfs import GridFS
from mongoengine.connection import get_db
from .models import Song
from .serializers import EnhancedSongSerializer, SongCreateSerializer
from apps.users.models import User
from apps.users.serializers import UserListSerializer, UserDetailSerializer

# Use the existing MongoDB connection from MongoEngine
db = get_db()
fs = GridFS(db)


class SongListView(ListCreateAPIView):
    serializer_class = EnhancedSongSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Song.findAll()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context


class SongDetailView(RetrieveAPIView):
    serializer_class = EnhancedSongSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        song_id = self.kwargs.get("song_id")
        return Song.findById(song_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context


class SongFileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, song_id):
        try:
            # Get the song document
            song = Song.findById(song_id)
            if not song:
                return Response(
                    {"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Get the file_id from the song's audio field
            file_id = song.audio.grid_id

            # Retrieve the file from GridFS
            if not fs.exists(file_id):
                return Response(
                    {"error": "Audio file not found"}, status=status.HTTP_404_NOT_FOUND
                )

            grid_file = fs.get(file_id)

            # Create a streaming response
            response = StreamingHttpResponse(
                grid_file, content_type=grid_file.content_type or "audio/mpeg"
            )

            # Set content disposition and length headers
            response["Content-Disposition"] = f'inline; filename="{song.title}.mp3"'
            response["Content-Length"] = grid_file.length

            return response

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SongVideoView(APIView):
    """View for streaming video files"""

    permission_classes = [AllowAny]

    def get(self, request, song_id):
        try:
            # Get the song document
            song = Song.findById(song_id)
            if not song:
                return Response(
                    {"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Get the file_id from the song's video field
            file_id = song.video.grid_id

            # Retrieve the file from GridFS
            if not fs.exists(file_id):
                return Response(
                    {"error": "Video file not found"}, status=status.HTTP_404_NOT_FOUND
                )

            grid_file = fs.get(file_id)

            # Create a streaming response
            response = StreamingHttpResponse(
                grid_file, content_type=grid_file.content_type or "video/mp4"
            )

            # Set content disposition and length headers
            response["Content-Disposition"] = f'inline; filename="{song.title}.mp4"'
            response["Content-Length"] = grid_file.length

            return response

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SongCoverView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, song_id):
        try:
            # Get the song document
            song = Song.findById(song_id)
            if not song:
                return Response(
                    {"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Get the file_id from the song's cover field
            file_id = song.cover.grid_id

            # Retrieve the file from GridFS
            if not fs.exists(file_id):
                return Response(
                    {"error": "Cover image not found"}, status=status.HTTP_404_NOT_FOUND
                )

            grid_file = fs.get(file_id)

            # Create a response with the image data
            response = HttpResponse(
                grid_file.read(), content_type=grid_file.content_type or "image/jpeg"
            )

            return response

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SongCreateView(APIView):
    """Create a new song with file uploads"""

    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SongCreateSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            song = serializer.save()
            if isinstance(song, ValueError):
                return Response(
                    {"error": str(song)}, status=status.HTTP_400_BAD_REQUEST
                )

            # Return the created song with all details including URLs
            response_serializer = EnhancedSongSerializer(
                song, context={"request": request}
            )
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SongBulkDestroyView(APIView):
    permission_classes = [AllowAny]
    # permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        print("REQUEST DATA: ", request.data.get("song_ids"))
        song_ids = request.data.get("song_ids", [])

        if not isinstance(song_ids, list):
            return Response(
                {"error": "Invalid data format. 'song_ids' must be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not song_ids:
            return Response(
                {"error": "No song IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        success = Song.delete_many(song_ids)
        if success:
            return Response(
                {"message": "Songs deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {"error": "No songs found or already deleted"},
                status=status.HTTP_404_NOT_FOUND,
            )


class SongSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("query", "").strip()
        search_type = request.query_params.get("type", "All").strip()
        user_id = request.query_params.get("user_id", "").strip("/")

        print("QUERY:", query)
        print("SEARCH TYPE:", search_type)
        print("USER ID:", user_id)

        if not query and not user_id:
            return Response({}, status=status.HTTP_200_OK)

        try:
            response_data = {}

            if search_type == "All" or search_type == "Songs":
                songs = Song.search(query)
                song_serializer = EnhancedSongSerializer(
                    songs, many=True, context={"request": request}
                )
                response_data["songs"] = song_serializer.data

            if search_type == "All" or search_type == "Users":
                users = User.search(query)
                user_data = []
                for user in users:
                    user_songs = Song.objects.filter(user=user, deleted_at=None)
                    user_serializer = UserDetailSerializer(
                        user, context={"request": request}
                    )
                    song_serializer = EnhancedSongSerializer(
                        user_songs, many=True, context={"request": request}
                    )
                    user_data.append(
                        {"user": user_serializer.data, "songs": song_serializer.data}
                    )
                response_data["users"] = user_data

            # if search_type == "All" or search_type == "Playlists":
            #     playlists = Playlist.search(query)
            #     playlist_serializer = PlaylistSerializer(
            #         playlists, many=True, context={"request": request}
            #     )
            #     response_data["playlists"] = playlist_serializer.data

            if user_id:
                try:
                    user = User.objects.get(id=user_id)  # Lấy thông tin người dùng
                    user_songs = Song.objects.filter(user=user, deleted_at=None)
                    song_serializer = EnhancedSongSerializer(
                        user_songs, many=True, context={"request": request}
                    )
                    response_data["songs_by_user"] = song_serializer.data
                except User.DoesNotExist:
                    return Response(
                        {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                    )

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
