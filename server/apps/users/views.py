from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class UserAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
           
            if serializer.is_valid():
                user = serializer.save()
                return Response(user, status=status.HTTP_201_CREATED)
            
            errors = serializer.errors
             
            if 'message' in errors and errors['message'] == ['Username was registered!']:
                return Response(errors, status=status.HTTP_409_CONFLICT)
            
            if 'message' in errors and errors['message'] == ['Email was registered!']:
                return Response(errors, status=status.HTTP_409_CONFLICT)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print('Internal Server Errors: ', e)
            return Response(
                'Internal Server Errors', 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        