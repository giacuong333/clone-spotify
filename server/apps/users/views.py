from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import UserListSerializer
from .models import User


class UserListView(ListCreateAPIView):
    serializer_class = UserListSerializer
    permission_classes = [AllowAny]  # For testing

    def get_queryset(self):
        return User.findAllByRoleUser()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
