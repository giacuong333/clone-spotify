from apps.users.models import User
import bcrypt

class MongoAuthBackend:
    def authenticate(self, request, email=None, password=None):
        try:
            # Tìm người dùng theo email
            user = User.objects(email=email).first()
            
            if not user:
                return None
            
            # Kiểm tra mật khẩu
            password_encoded = password.encode('utf-8')
            stored_password = user.password.encode('utf-8')
            
            if bcrypt.checkpw(password_encoded, stored_password):
                return user
            
            return None
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None