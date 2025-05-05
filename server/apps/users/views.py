from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from .serializers import UserSerializer, UserDetailSerializer, UserUpdateSerializer
from bson import ObjectId
from .models import User
import datetime


class UserListView(ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # For testing

    def get_queryset(self):
        return User.findAllByRoleUser()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return User.objects()

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            object_id = ObjectId(lookup_value)
            return self.get_queryset().get(id=object_id)
        except Exception:
            raise NotFound("User not found or invalid ID format.")


class UserUpdateView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return User.objects

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            object_id = ObjectId(lookup_value)
            return self.get_queryset().get(id=object_id)
        except Exception:
            raise NotFound("User not found.")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response(
                self.get_serializer(updated_user).data, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDeleteView(DestroyAPIView):
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return User.objects(deleted_at=None)

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            object_id = ObjectId(lookup_value)
            return self.get_queryset().get(id=object_id)
        except Exception:
            raise NotFound("User not found.")

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = datetime.datetime.now()
        instance.save()
        return Response(
            {"message": "User soft-deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
