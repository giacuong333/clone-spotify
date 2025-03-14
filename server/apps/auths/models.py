from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

class Auth: 
    def __init__(self, email, password):
        self.email = email
        self.password = password
        
    @staticmethod
    def logout(base64_encoded_token_string):
        token = RefreshToken(base64_encoded_token_string)
        token.blacklist()
    
    @staticmethod
    def refresh(refresh_token):
        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)
        user = User.get_by_email(refresh.payload['email'])
        
        user['_id'] = str(user['_id'])
        return {
            'access': access,
            'user': user
        }
        
    @staticmethod
    def generate_tokens(user_dict):      
        try:
            refresh = RefreshToken()
            access = AccessToken()
            
            refresh.payload['email'] = str(user_dict['email'])
            access.payload['email'] = str(user_dict['email'])
            user_dict['_id'] = str(user_dict['_id'])
            
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_dict
            }
        except Exception as e:
            raise ValueError(f"Token generation failed: {str(e)}")
