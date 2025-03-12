from apps.users.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class Auth: 
    def __init__(self, email, password):
        self.email = email
        self.password = password
    
    def login(self):
        user = User.get_by_email(self.email)
        return Auth.generate_tokens(user)
        
    def generate_tokens(user_dict):
        class UserWrapper:
            def __init__(self, data):
                self.id = str(data['_id'])
                self.username = data['username']
                self.email = data['email']
                self.playlist = data['playlist']
                self.favorite = data['favorite']
                self.history = data['history']
                self.isPremium = data['isPremium']

        user = UserWrapper(user_dict)
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
    def logout(self):
        # Do logout here
        pass
