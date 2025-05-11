from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.listenedAt.models import ListenedAt
from apps.songs.serializers import SongSerializer
from .serializers import RecentlyPlayedSerializer, UserUploadedSongsSerializer, UserGenreStatSerializer
from rest_framework.response import Response
from apps.songs.models import Song
from apps.downloadedAt.models import DownloadedAt
from django.utils import timezone
import datetime
from collections import Counter


# Create your views here.
class RecentlyPlayedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
         # Lấy số lượng bài hát muốn hiển thị từ query params, mặc định là 10
        limit = int(request.query_params.get('limit', 10))
        
        # Lấy danh sách lịch sử nghe của người dùng, sắp xếp theo thời gian mới nhất
        listened_history = ListenedAt.objects(
            user=request.user
        ).order_by('-listened_at')
        
        # Tạo danh sách các bài hát đã nghe (không trùng lặp)
        song_ids = []
        unique_songs = []

        for history in listened_history:
            song_id = str(history.song.id)
            if song_id not in song_ids:
                song_ids.append(song_id)
                unique_songs.append({
                    'song': history.song,
                    'last_listened_at': history.listened_at
                })
                
                # Dừng khi đã có đủ số lượng bài hát cần thiết
                if len(unique_songs) >= limit:
                    break
        
        # Serialize dữ liệu
        serializer = RecentlyPlayedSerializer(unique_songs, many=True)
        
        return Response({
            'results': serializer.data,
            'count': len(serializer.data)
        })
    
class UserUploadStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Lấy khoảng thời gian từ query params (mặc định lấy tất cả)
        time_period = request.query_params.get('period', 'all')  # all, week, month, year
        
        # Lấy tất cả bài hát do người dùng upload
        user_songs = Song.objects(user=request.user)
        
        # Tính thời gian bắt đầu dựa trên thời gian
        start_date = None
        if time_period != 'all':
            now = timezone.now()
            if time_period == 'week':
                start_date = now - datetime.timedelta(days=7)
            elif time_period == 'month':
                start_date = now - datetime.timedelta(days=30)
            elif time_period == 'year':
                start_date = now - datetime.timedelta(days=365)
        
        # Tạo dict lưu lượt nghe và download cho từng bài hát
        play_counts = {}
        download_counts = {}

        # Lọc truy vấn dựa trên thời gian
        listen_query = ListenedAt.objects(song__in=user_songs)
        download_query = DownloadedAt.objects(song__in=user_songs)
        
        if start_date:
            listen_query = listen_query.filter(listened_at__gte=start_date)
            download_query = download_query.filter(downloaded_at__gte=start_date)
        
        # Tính lượt nghe
        for listen in listen_query:
            song_id = str(listen.song.id)
            if song_id in play_counts:
                play_counts[song_id] += 1
            else:
                play_counts[song_id] = 1
                
        # Tính lượt download
        for download in download_query:
            song_id = str(download.song.id)
            if song_id in download_counts:
                download_counts[song_id] += 1
            else:
                download_counts[song_id] = 1
        
        # Lấy total counts để hiển thị tổng
        total_plays = sum(play_counts.values())
        total_downloads = sum(download_counts.values())
        
        # Tạo danh sách kết quả
        results = []
        for song in user_songs:
            song_id = str(song.id)
            results.append({
                'song': song,
                'play_count': play_counts.get(song_id, 0),
                'download_count': download_counts.get(song_id, 0)
            })
        
        # Sắp xếp theo lượt nghe (nhiều nhất lên đầu)
        sort_by = request.query_params.get('sort_by', 'play_count')
        reverse_sort = request.query_params.get('order', 'desc') == 'desc'
        
        if sort_by == 'play_count':
            results = sorted(results, key=lambda x: x['play_count'], reverse=reverse_sort)
        elif sort_by == 'download_count':
            results = sorted(results, key=lambda x: x['download_count'], reverse=reverse_sort)
        elif sort_by == 'date':
            # Sắp xếp theo ngày tạo của bài hát
            results = sorted(results, key=lambda x: x['song'].created_at, reverse=reverse_sort)
        
        # Serialize dữ liệu
        serializer = UserUploadedSongsSerializer(results, many=True)

        return Response({
            'results': serializer.data,
            'time_period': time_period,
            'total_plays': total_plays,
            'total_downloads': total_downloads,
            'total_uploads': len(results)
        })

class UserGenreStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Lấy khoảng thời gian từ query params (mặc định 30 ngày)
        days = int(request.query_params.get('days', 30))
        
        # Tính thời gian bắt đầu
        start_date = timezone.now() - datetime.timedelta(days=days)
        
        # Lấy lịch sử nghe của người dùng trong khoảng thời gian
        listen_history = ListenedAt.objects(
            user=request.user,
            listened_at__gte=start_date
        )

         # Đếm số lần nghe theo thể loại
        genre_counts = Counter()
        genre_song_counts = {}  # Đếm số bài hát khác nhau trong mỗi thể loại
        genre_names = {}  # Lưu tên của thể loại
        song_genre_map = {}  # Map bài hát với thể loại để tránh đếm trùng
        
        for listen in listen_history:
            song = listen.song
            song_id = str(song.id)

            # Kiểm tra và lấy thể loại của bài hát
            if hasattr(song, 'genre') and song.genre:
                genre_id = str(song.genre.id)
                genre_counts[genre_id] += 1
                
                # Lưu tên thể loại
                if genre_id not in genre_names:
                    genre_names[genre_id] = song.genre.name
                
                # Đếm số bài hát khác nhau (không trùng lặp)
                if song_id not in song_genre_map:
                    song_genre_map[song_id] = genre_id
                    
                    if genre_id in genre_song_counts:
                        genre_song_counts[genre_id] += 1
                    else:
                        genre_song_counts[genre_id] = 1
        
        # Tính tổng số lượt nghe
        total_plays = sum(genre_counts.values())
        
        # Tạo danh sách kết quả
        results = []
        for genre_id, play_count in genre_counts.items():
            results.append({
                'id': genre_id,
                'name': genre_names.get(genre_id, 'Unknown'),
                'play_count': play_count,
                'song_count': genre_song_counts.get(genre_id, 0),
                'percentage': round((play_count / total_plays) * 100, 2) if total_plays > 0 else 0
            })
        
        # Sắp xếp theo lượt nghe (nhiều nhất lên đầu)
        results = sorted(results, key=lambda x: x['play_count'], reverse=True)
        
        # Serialize dữ liệu
        serializer = UserGenreStatSerializer(results, many=True)
        
        return Response({
            'results': serializer.data,
            'time_range_days': days,
            'total_plays': total_plays,
            'genres_count': len(results),
        })
