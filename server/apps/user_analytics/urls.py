from django.urls import path
from .views import RecentlyPlayedView, UserUploadStatsView, UserGenreStatsView

urlpatterns = [
    path("recently-played/", RecentlyPlayedView.as_view(), name="recently_played"),
    path("upload-stats/", UserUploadStatsView.as_view(), name="user_upload_stats"),
    path("genre-stats/", UserGenreStatsView.as_view(), name="user_genre_stats"),
]
