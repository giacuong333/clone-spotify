from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from utils.convert_objectids_to_str import convert_objectids_to_str
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
        cursor = User.get_by_email(refresh.payload['email'])
        user = convert_objectids_to_str(cursor)
        return {
            'access': access,
            'user': user
        }
        
    @staticmethod
    def generate_tokens(user_dict):      
        try:
            user = convert_objectids_to_str(user_dict)
            refresh = RefreshToken()
            refresh['email'] = user['email']
            refresh['user_id'] = user['_id']
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user
            }
        except Exception as e:
            raise ValueError(f"Token generation failed: {str(e)}")
