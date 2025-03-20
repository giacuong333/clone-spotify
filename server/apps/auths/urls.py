from django.urls import path
from .views import LoginAPIView, RefreshAPIView, LogoutAPIView

urlpatterns = [
    path('login', LoginAPIView.as_view(), name='login'),
    path('logout', LogoutAPIView.as_view(), name='logout'),
    path('refresh', RefreshAPIView.as_view(), name='refresh'),
]