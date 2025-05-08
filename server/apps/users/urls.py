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
    UserRenderView,
    UserUpdateView,
    UserSearchView,
)

urlpatterns = [
    path("query/", UserSearchView.as_view(), name="user-query"),
    path("register/", RegisterUserView.as_view(), name="user_register"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("stats/", UserStatsView.as_view(), name="user_stats"),
    # C admin
    path("render/", UserRenderView.as_view(), name="admin_user_list"),
    path("", UserListView.as_view(), name="admin_user_list"),
    path("<str:user_id>/", UserDetailView.as_view(), name="admin_user_detail"),
    path("<str:user_id>/stats/", UserStatsByIdView.as_view(), name="admin_user_stats"),
    path("<str:user_id>/delete/", UserDeleteView.as_view(), name="admin_user_delete"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin_overall_stats"),
    path("<str:id>", UserDetailView.as_view(), name="user-detail"),
    path("<str:id>/update", UserUpdateView.as_view(), name="user-update"),
    path("<str:id>/delete", UserDeleteView.as_view(), name="user-delete"),
]
