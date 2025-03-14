from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AuthSerializer
from .models import Auth

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = AuthSerializer(data=request.data)
            if serializer.is_valid():
                response_data = serializer.validated_data
                response = Response({
                    'access': response_data['access'],
                    'user': response_data['user']
                }, status=status.HTTP_200_OK)
                response.set_cookie(
                    key="refresh",
                    value=response_data['refresh'],
                    httponly=True, 
                    secure=True, # used for developing not for production
                    samesite="None",
                    path="/"
            )
                return response
            
            errors = serializer.errors
            if 'message' in errors and errors['message'] == ['Account does not exist!']:
                return Response(errors['message'][0], status=status.HTTP_404_NOT_FOUND)
            elif 'message' in errors and errors['message'] == ['Password is incorrect!']:
                return Response(errors['message'][0], status=status.HTTP_400_BAD_REQUEST)    
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)    
        except Exception as e:
            print('Internal Server Errors', e)
            return Response('Internal Server Errors', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class LogoutAPIView(APIView):
    permission_classes = [AllowAny]
        
    def post(self, request):    
        print('This method will be invoked')    
        try:
            refresh_token = request.COOKIES.get('refresh')
            if not refresh_token: 
                return Response({'message': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            Auth.logout(refresh_token)
            response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh')
            return response
        except Exception as e:
            print('Internal Server Errors', e)
            return Response('Internal Server Errors', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class RefreshAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh')
        print(f"Cookies received: {request.COOKIES}")
        if not refresh_token:
            return Response({"message": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = Auth.refresh(refresh_token)
            response = Response(result, status=status.HTTP_200_OK)
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                httponly=True, 
                secure=True,  # Set to True in production with HTTPS
                samesite="None",
                path="/"
            )
            return response
        except Exception as e:
            print('Internal Server Errors', e)
            return Response({"message": f"Invalid refresh token: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)