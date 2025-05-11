from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ListenedAtSerializer
from .models import ListenedAt
from apps.songs.models import Song
from datetime import datetime


class GetAllListenedAtView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            listened_at_records = ListenedAt.objects.all()

            serializer = ListenedAtSerializer(listened_at_records, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SaveListenedAtView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        song_id = request.data.get("song_id")

        if not song_id:
            return Response("song_id is required", status=status.HTTP_400_BAD_REQUEST)

        if user.role != "user":  # Assuming role is an attribute
            return Response(
                "Admins cannot add to listened songs", status=status.HTTP_403_FORBIDDEN
            )

        try:
            song = Song.findById(song_id)
            if not song:
                return Response("Song not found", status=status.HTTP_404_NOT_FOUND)

            data = {"user": user, "song": song, "listened_at": datetime.now()}
            listened_at = ListenedAt.create(data)
            return Response("Saved listenedAt", status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                f"Error saving ListenedAt: {str(e)}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
