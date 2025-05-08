from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # Oauth2.0 Google login
    path('google/auth-url/', views.GoogleAuthURLView.as_view(), name='google_auth_url'),
    path('google/callback/', views.GoogleCallbackView.as_view(), name='google_callback'),
]