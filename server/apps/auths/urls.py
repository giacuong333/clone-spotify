# server/apps/auths/urls.py
from django.urls import path
from .views import MyTokenObtainPairView #, LogoutView 
# from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('logout/', LogoutView.as_view(), name='auth_logout'),
    # path('refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]