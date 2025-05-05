from rest_framework import serializers
from apps.users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    email = serializers.EmailField()
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    image_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    role = serializers.CharField(read_only=True)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.image_url = validated_data.get('image_url', instance.image_url)
        instance.save()
        return instance

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)
    
    def validate_email(self, value):
        if User.objects(email=value):
            raise serializers.ValidationError("Email đã tồn tại trong hệ thống.")
        return value
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Mật khẩu không khớp.")
        return data
    
    def create(self, validated_data):
        # Mã hóa mật khẩu
        password = validated_data['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Tạo người dùng mới
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            password=hashed_password
        )
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    def validate(self, attrs):
        # Tìm người dùng theo email
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        
        if email and password:
            # Tìm user theo email
            user = User.objects(email=email).first()
            
            if not user:
                raise serializers.ValidationError("Email hoặc mật khẩu không chính xác.")
            
            # Kiểm tra mật khẩu
            password_encoded = password.encode('utf-8')
            stored_password = user.password.encode('utf-8')
            
            if not bcrypt.checkpw(password_encoded, stored_password):
                raise serializers.ValidationError("Email hoặc mật khẩu không chính xác.")
            
            # Tạo token
            refresh = RefreshToken()
    
            # Đặt user_id như một chuỗi
            refresh[api_settings.USER_ID_CLAIM] = str(user.id)
            
            # Thêm các thông tin bổ sung nếu cần
            refresh['email'] = user.email
            refresh['name'] = user.name
            
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': str(user.id),
                    'name': user.name,
                    'email': user.email,
                    'role': user.role,
                    'bio': user.bio,
                    'image_url': user.image_url,
                }
            }
            return data
        else:
            raise serializers.ValidationError("Phải cung cấp cả email và mật khẩu.")
    
    @classmethod
    def get_token(cls, user):
        refresh = RefreshToken()
        
        # Thêm custom claims
        refresh['user_id'] = str(user.id)
        refresh['email'] = user.email
        refresh['name'] = user.name
        refresh['role'] = user.role
        
        return refresh

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        # Tìm user
        user = User.objects(email=email).first()
        if not user:
            raise serializers.ValidationError({"email": "Email hoặc mật khẩu không chính xác"})
        
        # Kiểm tra mật khẩu
        stored_password = user.password.encode('utf-8')
        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            raise serializers.ValidationError({"password": "Email hoặc mật khẩu không chính xác"})
        
        # Tạo token
        refresh = RefreshToken()
        refresh['user_id'] = str(user.id)
        refresh['email'] = user.email
        refresh['name'] = user.name
        refresh['role'] = user.role

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': str(user.id),
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'bio': user.bio,
                'image_url': user.image_url,
            }
        }
        
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Mật khẩu mới không khớp.")
        return data