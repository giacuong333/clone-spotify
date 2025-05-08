
from django.conf import settings
from urllib.parse import urlencode
import requests
from apps.users.models import User
import uuid
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken

def generate_google_auth_url():
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    return f"{base_url}?{urlencode(params)}"

def get_google_tokens(code):
    token_url = "https://oauth2.googleapis.com/token"
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
    }
    response = requests.post(token_url, data=params)
    if response.status_code != 200:
        print("Error getting Google tokens:", response.json())
        return None
    return response.json()

def get_google_user_info(access_token):
    user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {'Authorization': f'Bearer {access_token}'}

    response = requests.get(user_info_url, headers=headers)
    if response.status_code != 200:
        print("Error getting Google user info:", response.json())
        return None
    return response.json()

def get_or_create_user(user_info):
    email = user_info.get("email")
    google_id = user_info.get("sub")

    # Kiểm tra user có log bằng google chưa
    user = User.objects(google_id=google_id).first()
    if user:
        return user
    
    print("Lấy được user info từ google")
    print(f"User info: {user_info}")
    
    # Kiểm tra user có tồn tại trong db không và
    # nếu có thì update google_id và is_oauth_user
    user = User.objects(email=email).first()
    if user:
        user.google_id = google_id
        user.is_oauth_user = True
        user.save()
        return user
    
    # Nếu không có user nào thì tạo mới
    random_password = str(uuid.uuid4())
    hashed_password = bcrypt.hashpw(random_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    user = User(
        name=user_info.get("name"),
        email=email,
        password=hashed_password,
        google_id=google_id,
        is_oauth_user=True,
    )
    user.save()
    return user

def create_tokens(user):
    refresh = RefreshToken()

    # Thêm Claims
    refresh['user_id'] = str(user.id)
    refresh['email'] = user.email
    refresh['name'] = user.name
    refresh['is_oauth_user'] = user.is_oauth_user
    refresh['role'] = user.role

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': str(user.id),
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'is_oauth_user': user.is_oauth_user,
        }
    }