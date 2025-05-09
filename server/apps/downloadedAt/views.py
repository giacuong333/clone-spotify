from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import DownloadedAt
from apps.songs.models import Song
from datetime import datetime


class SaveDownloadedAt(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        song_id = request.data.get("song_id")

        if not song_id:
            return Response("song_id is required", status=status.HTTP_400_BAD_REQUEST)

        if user.role != "user":  # Assuming role is an attribute
            return Response(
                "Admins cannot download songs", status=status.HTTP_403_FORBIDDEN
            )

        try:
            song = Song.findById(song_id)
            if not song:
                return Response("Song not found", status=status.HTTP_404_NOT_FOUND)

            data = {"user": user, "song": song, "downloaded_at": datetime.now()}
            downloaded_at = DownloadedAt.create(data)
            return Response("Saved downloadedAt", status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                f"Error saving downloadedAt: {str(e)}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
