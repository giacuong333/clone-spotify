from django.shortcuts import render
from rest_framework.views import APIView
from apps.songs.models import Song, Genre
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from apps.admin_analytics.serializers import SongStatsSerializer, GenreStatsSerializer, HourlyStatsSerializer
from apps.listenedAt.models import ListenedAt
from apps.downloadedAt.models import DownloadedAt
from django.utils import timezone
import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse
from reportlab.lib.units import inch
import io
from django.utils import timezone

# Create your views here.
class TopSongsView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        # Lấy tham số từ query
        limit = int(request.query_params.get('limit', 20))
        time_range = request.query_params.get('range', '30')  # Số ngày
        days = int(time_range)
        
        # Tính thời gian bắt đầu
        start_date = timezone.now() - datetime.timedelta(days=days)
        
        # Lấy lượt nghe trong thời gian quy định
        play_counts = {}
        for play in ListenedAt.objects(listened_at__gte=start_date):
            song_id = str(play.song.id)
            if song_id in play_counts:
                play_counts[song_id] += 1
            else:
                play_counts[song_id] = 1

         # Lấy lượt download trong thời gian quy định
        download_counts = {}
        for download in DownloadedAt.objects(downloaded_at__gte=start_date):
            song_id = str(download.song.id)
            if song_id in download_counts:
                download_counts[song_id] += 1
            else:
                download_counts[song_id] = 1

        results = []
        for song in Song.objects():
            song_id = str(song.id)
            play_count = play_counts.get(song_id, 0)
            download_count = download_counts.get(song_id, 0)
            
            results.append({
                'id': song_id,
                'title': song.title,
                'artist_name': song.artist.name if hasattr(song, 'artist') and song.artist else "Unknown",
                'album_title': song.album.title if hasattr(song, 'album') and song.album else None,
                'play_count': play_count,
                'download_count': download_count
            })
        
        # Sắp xếp theo lượt nghe hoặc download
        sort_by = request.query_params.get('sort_by', 'play_count')
        if sort_by == 'play_count':
            results = sorted(results, key=lambda x: x['play_count'], reverse=True)[:limit]
        elif sort_by == 'download_count':
            results = sorted(results, key=lambda x: x['download_count'], reverse=True)[:limit]
        
        # Serialize kết quả
        serializer = SongStatsSerializer(results, many=True)
        
        return Response({
            'results': serializer.data,
            'time_range_days': days,
            'sorted_by': sort_by
        })
    
class GenreStatsView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        # Lấy tham số từ query
        time_range = request.query_params.get('range', '30')  # Số ngày
        days = int(time_range)
        
        # Tính thời gian bắt đầu
        start_date = timezone.now() - datetime.timedelta(days=days)
        
        # Lượt nghe theo bài hát
        play_counts = {}
        for play in ListenedAt.objects(listened_at__gte=start_date):
            song_id = str(play.song.id)
            if song_id in play_counts:
                play_counts[song_id] += 1
            else:
                play_counts[song_id] = 1
        
        # Tính toán số lượt nghe theo thể loại
        genre_stats = {}
        for song in Song.objects():
            song_id = str(song.id)
            play_count = play_counts.get(song_id, 0)
            
            # Lấy thể loại
            genre = song.genre if hasattr(song, 'genre') else None
            if genre:
                genre_id = str(genre.id)
                if genre_id not in genre_stats:
                    genre_stats[genre_id] = {
                        'id': genre_id,
                        'name': genre.name,
                        'song_count': 0,
                        'play_count': 0
                    }
                
                genre_stats[genre_id]['song_count'] += 1
                genre_stats[genre_id]['play_count'] += play_count
        
        # Chuyển dictionary thành list
        results = list(genre_stats.values())
        # Sắp xếp theo lượt nghe
        results = sorted(results, key=lambda x: x['play_count'], reverse=True)
        
        # Serialize kết quả
        serializer = GenreStatsSerializer(results, many=True)
        
        return Response({
            'results': serializer.data,
            'time_range_days': days
        })
    
class PeekHoursView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        # Lấy tham số từ query
        time_range = request.query_params.get('range', '30')  # Số ngày
        days = int(time_range)

        # Tính thời gian bắt đầu
        start_date = timezone.now() - datetime.timedelta(days=days)
        
        # Đếm số lượt nghe theo giờ
        hourly_counts = [0] * 24
        
        for listen in ListenedAt.objects(listened_at__gte=start_date):
            hour = listen.listened_at.hour
            hourly_counts[hour] += 1

        results = []
        for hour in range(24):
            results.append({
                'hour': hour,
                'play_count': hourly_counts[hour]
            })
        
        # Sắp xếp theo số lượt nghe
        sorted_results = sorted(results, key=lambda x: x['play_count'], reverse=True)
        
        # Tìm giờ cao điểm
        peak_hour = sorted_results[0]['hour'] if sorted_results else None
        
        # Sắp xếp lại theo giờ cho output
        results = sorted(results, key=lambda x: x['hour'])
        
        # Serialize kết quả
        serializer = HourlyStatsSerializer(results, many=True)
        
        return Response({
            'results': serializer.data,
            'peak_hour': peak_hour,
            'time_range_days': days
        })
    
class ExportPDFView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        # Lấy loại báo cáo từ query params
        report_type = request.query_params.get('type', 'songs')  # songs, genres, peak_hours
        time_range = request.query_params.get('range', '30')  # Số ngày
        days = int(time_range)

         # Tạo response với content type là PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{report_type}_report.pdf"'
        
        # Tạo buffer để lưu PDF
        buffer = io.BytesIO()
        
        # Tạo document
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        # Tiêu đề báo cáo
        styles = getSampleStyleSheet()
        title = Paragraph(f"Spotify Clone - {report_type.capitalize()} Report", styles['Title'])
        elements.append(title)

         # Thêm ngày tạo báo cáo
        date_text = Paragraph(f"Generated on: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal'])
        period_text = Paragraph(f"Period: Last {days} days", styles['Normal'])
        elements.append(date_text)
        elements.append(period_text)
        elements.append(Spacer(1, 0.2*inch))
        
        # Tạo dữ liệu báo cáo dựa trên loại báo cáo
        if report_type == 'songs':
            # Lấy API data
            view = TopSongsView()
            request._request.GET = request._request.GET.copy()
            request._request.GET['sort_by'] = 'play_count'
            response_data = view.get(request).data
            
            # Tạo bảng cho top songs
            elements.append(Paragraph("Top Songs by Play Count", styles['Heading1']))
            elements.append(Spacer(1, 0.1*inch))

            data = [['Rank', 'Song Title', 'Artist', 'Play Count', 'Downloads']]
            for i, song in enumerate(response_data['results']):
                data.append([
                    i+1,
                    song['title'],
                    song['artist_name'],
                    song['play_count'],
                    song['download_count']
                ])
        
             # Tạo bảng
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))

            elements.append(table)
            elements.append(Spacer(1, 0.3*inch))
            
            # Thêm top downloads
            request._request.GET['sort_by'] = 'download_count'
            response_data = view.get(request).data
            
            elements.append(Paragraph("Top Songs by Download Count", styles['Heading1']))
            elements.append(Spacer(1, 0.1*inch))
            
            data = [['Rank', 'Song Title', 'Artist', 'Downloads', 'Play Count']]
            for i, song in enumerate(response_data['results']):
                data.append([
                    i+1,
                    song['title'],
                    song['artist_name'],
                    song['download_count'],
                    song['play_count']
                ])

            # Tạo bảng
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(table)
        elif report_type == 'genres':
            # Lấy API data
            view = GenreStatsView()
            response_data = view.get(request).data
            
            # Tạo bảng cho thể loại
            elements.append(Paragraph("Genre Statistics", styles['Heading1']))
            elements.append(Spacer(1, 0.1*inch))
            
            data = [['Rank', 'Genre', 'Total Plays', 'Song Count', 'Average Plays per Song']]
            for i, genre in enumerate(response_data['results']):
                avg_plays = round(genre['play_count'] / genre['song_count'], 2) if genre['song_count'] > 0 else 0
                data.append([
                    i+1,
                    genre['name'],
                    genre['play_count'],
                    genre['song_count'],
                    avg_plays
                ])
            
             # Tạo bảng
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(table)
        elif report_type == 'peak_hours':
            # Lấy API data
            view = PeekHoursView()
            response_data = view.get(request).data
            
            # Tạo bảng cho peak hours
            elements.append(Paragraph("Peak Hours Analysis", styles['Heading1']))
            elements.append(Spacer(1, 0.1*inch))
            
            peak_hour_info = f"Peak Hour: {response_data['peak_hour']}:00 - {(response_data['peak_hour'] + 1) % 24}:00"
            elements.append(Paragraph(peak_hour_info, styles['Heading2']))
            elements.append(Spacer(1, 0.1*inch))
            
            data = [['Hour', 'Play Count']]
            for hour_data in sorted(response_data['results'], key=lambda x: x['hour']):
                hour_str = f"{hour_data['hour']}:00 - {(hour_data['hour'] + 1) % 24}:00"
                data.append([
                    hour_str,
                    hour_data['play_count']
                ])
            # Tạo bảng
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(table)
        
        # Xây dựng PDF
        doc.build(elements)
        
        # Lấy PDF từ buffer
        pdf = buffer.getvalue()
        buffer.close()
        
        # Trả về PDF
        response.write(pdf)
        return response