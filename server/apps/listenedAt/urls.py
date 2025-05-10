from django.urls import path
from apps.listenedAt.views import SaveListenedAtView, GetAllListenedAtView

urlpatterns = [
    path("", GetAllListenedAtView.as_view(), name="get-all-listened-at"),
    path("save/", SaveListenedAtView.as_view(), name="save-listen"),
]
