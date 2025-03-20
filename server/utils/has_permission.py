from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from apps.users.models import User
class HasRolePermission(BasePermission):
    
    def __init__(self, allowed_roles):
        self.allowed_roles = allowed_roles
        
    def has_permission(self, request, view):
        jwt_auth = JWTAuthentication() # Extract user from jwt
        try: 
            user, _ = jwt_auth.authenticate(request)
        except:
            return False # Invalid token
        
        if not user:
            return False
        
        token = request.headers.get('Authorization', '').split(' ')[1]
        decoded_token = AccessToken(token)
        email = decoded_token['email']
        user_data = User.get_by_email(email)
        
        if not user_data:
            return False
        
        return user_data['role'] in self.allowed_roles