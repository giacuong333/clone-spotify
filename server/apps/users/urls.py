# server/apps/users/urls.py
from django.urls import path
from .views import (
    UserListView,       # For admin listing users, typically at the root of /users/ if for admin
    UserDetailView,     # For specific user details by ID
    UserProfileView,    # For the logged-in user's own profile
    UserStatsView,      # For the logged-in user's own stats
    RegisterUserView,
    UserStatsByIdView,  # For admin to view stats of a specific user by ID
    UserDeleteView,     # For deleting a user by ID (the more specific one)
    AdminStatsView,
    UserRenderView,     # For rendering users, perhaps for admin UI
    UserUpdateView,     # For updating a user by ID
    UserSearchView,
    UserSongHistoryView # <<--- Make sure this view is correctly defined and imported
)

urlpatterns = [
    # Specific paths should always come before dynamic paths like <str:id>

    # Paths that don't take a dynamic ID in the first segment
    path("query/", UserSearchView.as_view(), name="user_query"),
    path("register/", RegisterUserView.as_view(), name="user_register"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("stats/", UserStatsView.as_view(), name="user_stats"), # Logged-in user's stats

    # CRITICAL: Place "song-history/" BEFORE any path that uses a dynamic <str:id> or <str:user_id>
    # that could mistakenly capture "song-history" as an ID.
    path("song-history/", UserSongHistoryView.as_view(), name="user_song_history"),

    path("render/", UserRenderView.as_view(), name="admin_user_list_render"), # Specific path for admin rendering
    path("admin/stats/", AdminStatsView.as_view(), name="admin_overall_stats"),

    # General list view, often for admin (assuming it doesn't conflict with UserRenderView if both are for listing)
    # If UserListView is for the root of /users/ for admin, it's fine here.
    # If it's meant to be a public list, consider its placement carefully.
    path("", UserListView.as_view(), name="user_list_admin"), # Example: Admin user list

    # Dynamic paths with <str:id> or <str:user_id> should come LAST
    # Ensure these paths have a trailing slash if that's your convention
    path("<str:id>/", UserDetailView.as_view(), name="user_detail"),
    path("<str:user_id>/stats/", UserStatsByIdView.as_view(), name="admin_user_stats_by_id"),
    path("<str:id>/update/", UserUpdateView.as_view(), name="user_update"),
    path("<str:id>/delete/", UserDeleteView.as_view(), name="user_delete_by_id"), # Renamed for clarity
]
