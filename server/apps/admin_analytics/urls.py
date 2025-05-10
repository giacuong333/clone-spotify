from django.urls import path
from .views import TopSongsView, GenreStatsView, PeekHoursView, ExportPDFView

urlpatterns = [
    path('top-songs/', TopSongsView.as_view(), name='top_songs'),
    path('genre-stats/', GenreStatsView.as_view(), name='genre_stats'),
    path('peek-hours/', PeekHoursView.as_view(), name='peek_hours'),
    path('export-pdf/', ExportPDFView.as_view(), name='export_pdf'),
]