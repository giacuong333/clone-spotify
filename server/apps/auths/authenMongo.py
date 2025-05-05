from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from apps.users.models import User

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Lấy user từ MongoDB thay vì Django ORM
        """
        user_id = validated_token[api_settings.USER_ID_CLAIM]
        
        if not user_id:
            return None
            
        try:
            # Sử dụng mongoengine để lấy user
            user = User.objects(id=user_id).first()
            return user
        except Exception as e:
            print(f"Error getting user: {e}")
            return None