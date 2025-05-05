from django.urls import path
from .views import (
    GenreListView,
    GenreCreateView,
    GenreUpdateView,
    GenreDeleteView,
)

urlpatterns = [
    path('', GenreListView.as_view(), name='genre_list'),
    path('create/', GenreCreateView.as_view(), name='genre_create'),
     path('<str:pk>/update/', GenreUpdateView.as_view(), name='genre_update'),
    path('delete/', GenreDeleteView.as_view(), name='genre_delete'),
]