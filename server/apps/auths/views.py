from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AuthSerializer

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = AuthSerializer(data=request.data)
            if serializer.is_valid():
                return Response(serializer.validated_data, status=status.HTTP_200_OK)
            
            errors = serializer.errors
            if 'message' in errors and errors['message'] == ['Account does not exist!']:
                return Response(errors, status=status.HTTP_404_NOT_FOUND)
            elif 'message' in errors and errors['message'] == ['Password is incorrect!']:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)    
            
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)    
        except Exception as e:
                print('Internal Server Errors', e)
                return Response('Internal Server Errors', status=status.HTTP_500_INTERNAL_SERVER_ERROR)