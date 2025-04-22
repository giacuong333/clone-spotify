from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class CreateUserAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            print("Payload:", request.data)
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                print("Created user:", user)
                return Response(user, status=status.HTTP_201_CREATED)
            
            errors = serializer.errors
            if 'message' in errors and errors['message'] == ['Email was registered!']:
                return Response(errors['message'][0], status=status.HTTP_409_CONFLICT)
            
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print('Internal Server Errors: ', e)
            return Response(
                'Internal Server Errors', 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        