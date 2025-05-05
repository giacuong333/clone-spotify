from django.urls import path
from .views import UserListView, UserDetailView, UserUpdateView, UserDeleteView

urlpatterns = [
    path("", UserListView.as_view(), name="user-list"),
    path("<str:id>", UserDetailView.as_view(), name="user-detail"),
    path("<str:id>/update", UserUpdateView.as_view(), name="user-update"),
    path("<str:id>/delete", UserDeleteView.as_view(), name="user-delete"),
]
