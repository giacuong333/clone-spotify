from django.urls import path
from apps.listenedAt.views import SaveListenedAtView

urlpatterns = [
    path("save/", SaveListenedAtView.as_view(), name="save-listen")
]
 