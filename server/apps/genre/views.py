from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Genre
from .serializers import GenreSerializer
from rest_framework.permissions import AllowAny


# List and Create Genres
class GenreListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print("Fetching all genres")
        genres = Genre.objects()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GenreCreateView(APIView):
    def post(self, request):
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            genre = Genre(name=serializer.validated_data["name"])
            genre.save()
            return Response(GenreSerializer(genre).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenreUpdateView(APIView):
    def put(self, request, pk):
        try:
            # Lấy thể loại cần cập nhật
            genre = Genre.objects.get(pk=pk)
        except Genre.DoesNotExist:
            return Response(
                {"error": "Genre not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Deserialize dữ liệu từ request
        serializer = GenreSerializer(genre, data=request.data)
        if serializer.is_valid():
            serializer.save()  # Lưu dữ liệu đã cập nhật
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenreDeleteView(APIView):
    def post(self, request):
        genre_ids = request.data.get("genre_ids", [])
        print("Received genre_ids:", genre_ids)  # Log dữ liệu nhận được

        # Kiểm tra nếu genre_ids không phải là danh sách
        if not isinstance(genre_ids, list):
            return Response(
                {"error": "Invalid data format. 'genre_ids' must be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not genre_ids:
            return Response(
                {"error": "No genre IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Xóa các thể loại dựa trên danh sách ID
        deleted_count = Genre.objects.filter(id__in=genre_ids).delete()
        return Response(
            {"message": f"{deleted_count} genres deleted successfully"},
            status=status.HTTP_200_OK,
        )
