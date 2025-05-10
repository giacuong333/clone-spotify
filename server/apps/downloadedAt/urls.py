from django.urls import path
from apps.downloadedAt.views import SaveDownloadedAt

urlpatterns = [
    path("save/", SaveDownloadedAt.as_view(), name="save-download")
]
 