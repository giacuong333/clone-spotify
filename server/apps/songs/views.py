from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Song
from .serializers import SongSerializer


class Find(APIView):
    permission_classes = [AllowAny]  # For testing

    def get(self, request, song_id=None):
        if song_id:
            song = Song.findById(song_id)
            if not song:
                return Response(
                    {"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND
                )

            serializer = SongSerializer(song)
            return Response(serializer.data)

        songs = Song.findAll()
        serializer = SongSerializer(songs, many=True)
        
        return Response(serializer.data)


class Create(APIView):
    permission_classes = [AllowAny]  # For testing
    
    def post(self, request):
        pass


class Update(APIView):
    pass


class Delete(APIView):
    def delete(self, request, song_id):
        if Song.delete(song_id):
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
