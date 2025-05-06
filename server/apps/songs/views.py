from django.http import HttpResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from gridfs import GridFS
from mongoengine.connection import get_db
from .models import Song
from .serializers import EnhancedSongSerializer, SongCreateSerializer

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
    permission_classes = [IsAuthenticated]

    def delete(self, request):
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
