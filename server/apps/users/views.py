from rest_framework.generics import ListCreateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserRegisterSerializer
from .models import User
from utils.hash_and_verify_password import hash_password
from rest_framework.permissions import IsAuthenticated, AllowAny


class UserListView(ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.findAllByRoleUser()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserRegisterView(ListCreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if User.findByEmail(request.data.get("email")):
            return Response(
                {"message": "Email already exists"}, status=status.HTTP_409_CONFLICT
            )
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        validated_data["password"] = hash_password(validated_data["password"])
        user = serializer.create(validated_data)
        return Response({"_id": user["_id"]}, status=status.HTTP_201_CREATED)
