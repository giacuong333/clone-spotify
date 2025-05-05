from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import User
from utils.hash_and_verify_password import hash_password
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission
from mongoengine import DoesNotExist
import datetime

# Import models và serializers
from .models import User
from apps.listenedAt.models import ListenedAt
from apps.downloadedAt.models import DownloadedAt
from apps.songs.models import Song
from .serializers import (
    UserDisplaySerializer,
    UserProfileUpdateSerializer,
    UserCreationSerializer,
    UserListSerializer
)

class UserRenderView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            users = User.objects(deleted_at=None)
            serializer = UserListSerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching users."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --- Custom Permission Class ---
class IsAdminRole(BasePermission):
    message = "Yêu cầu quyền Admin."

    def has_permission(self, request, view):
        if not request.user:
            return False
        if not request.user.is_authenticated:
            return False

        role_direct = getattr(request.user, "role", "Not Found Direct")
        has_admin_role = role_direct == "admin"
        return has_admin_role


# --- Kết thúc Custom Permission Class ---


# === View Đăng Ký ===
class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            hashed_pwd = hash_password(validated_data["password"])
            validated_data["password"] = hashed_pwd
            try:
                user = User(**validated_data)
                user.save()
                display_serializer = UserDisplaySerializer(user)
                return Response(display_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": "Failed to create user."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# === View Cho Admin Quản Lý User ===
class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        try:
            users = User.objects(deleted_at=None)
            serializer = UserDisplaySerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching users."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, deleted_at=None)
            serializer = UserDisplaySerializer(user)
            return Response(serializer.data)
        except DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user:
            return Response(
                {"error": "User not authenticated properly."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = UserDisplaySerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        if not request.user:
            return Response(
                {"error": "User not authenticated properly."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = UserProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            updated_user = serializer.save()
            display_serializer = UserDisplaySerializer(updated_user)
            return Response(display_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Thống kê người dùng ---
class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            listen_count = ListenedAt.objects(user=user).count()
            download_count = DownloadedAt.objects(user=user).count()
            stats_data = {
                "total_listens": listen_count,
                "total_downloads": download_count,
            }
            return Response(stats_data)
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching your stats."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserStatsByIdView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, deleted_at=None)
            listens = ListenedAt.objects(user=user).count()
            downloads = DownloadedAt.objects(user=user).count()
            data = {
                "user_id": str(user.id),
                "name": user.name,
                "total_listens": listens,
                "total_downloads": downloads,
            }
            return Response(data)
        except DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --- Xóa User --- (Optional)
class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, deleted_at=None)
            user.deleted_at = datetime.datetime.now()
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        try:
            total_users = User.objects(deleted_at=None).count()
            total_songs = Song.objects(deleted_at=None).count()
            total_listens = ListenedAt.objects.count()
            total_downloads = DownloadedAt.objects.count()

            stats_data = {
                "total_users": total_users,
                "total_songs": total_songs,
                "total_listens": total_listens,
                "total_downloads": total_downloads,
            }
            return Response(stats_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Ghi log lỗi ở đây nếu cần thiết
            print(f"Error fetching admin stats: {e}")
            return Response(
                {"error": "An error occurred while fetching statistics."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
