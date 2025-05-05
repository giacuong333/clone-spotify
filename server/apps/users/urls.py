# server/apps/users/urls.py
from django.urls import path
from .views import (
    UserListView,
    UserDetailView,
    UserProfileView,
    UserStatsView,
    RegisterUserView,
    UserStatsByIdView,
    UserDeleteView,
    AdminStatsView,
)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='user_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('stats/', UserStatsView.as_view(), name='user_stats'),

    # C admin
    path('', UserListView.as_view(), name='admin_user_list'),
    path('<str:user_id>/', UserDetailView.as_view(), name='admin_user_detail'), 
    path('<str:user_id>/stats/', UserStatsByIdView.as_view(), name='admin_user_stats'),
    path('<str:user_id>/delete/', UserDeleteView.as_view(), name='admin_user_delete'), 
    path('admin/stats/', AdminStatsView.as_view(), name='admin_overall_stats'), 

]