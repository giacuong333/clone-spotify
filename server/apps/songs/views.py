# server/apps/songs/views.py

from django.http import HttpResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from gridfs import GridFS
from mongoengine.connection import get_db
from .models import Song
from apps.users.models import User # Import User model
from .serializers import EnhancedSongSerializer, SongCreateSerializer, SongWithOverallStatsSerializer # Đảm bảo import SongWithOverallStatsSerializer
from apps.users.serializers import UserListSerializer, UserDetailSerializer # Import các user serializers cần thiết

# Pagination - Đảm bảo import đúng
from rest_framework.pagination import PageNumberPagination

# Models cho thống kê
from apps.listenedAt.models import ListenedAt
from apps.downloadedAt.models import DownloadedAt
from bson import ObjectId # Import ObjectId

db = get_db()
fs = GridFS(db)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # Số lượng item mỗi trang
    page_size_query_param = 'page_size'
    max_page_size = 100



class SongListView(ListCreateAPIView):
    serializer_class = EnhancedSongSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Song.findAll()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # context['request'] = self.request # Đảm bảo request được truyền vào context
        return context


class SongDetailView(RetrieveAPIView):
    serializer_class = EnhancedSongSerializer # Hoặc một serializer chi tiết hơn nếu cần
    permission_classes = [AllowAny]
    lookup_field = 'song_id' # Hoặc pk, tùy theo URL pattern của bro

    def get_object(self):
        song_id_str = self.kwargs.get(self.lookup_field)
        try:
            # Chuyển đổi song_id_str thành ObjectId
            song_id_obj = ObjectId(song_id_str)
            song = Song.findById(song_id_obj) # Giả sử findById chấp nhận ObjectId
            if not song:
                raise Song.DoesNotExist
            return song
        except (ValueError, Song.DoesNotExist): # Bắt lỗi nếu ID không hợp lệ hoặc không tìm thấy song
            from django.http import Http404
            raise Http404("Song not found or invalid ID format.")


    def get_serializer_context(self):
        context = super().get_serializer_context()
        # context['request'] = self.request
        return context

class SongFileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, song_id):
        try:
            song = Song.findById(ObjectId(song_id))
            if not song or not song.audio or not hasattr(song.audio, 'grid_id') or not song.audio.grid_id:
                return Response({"error": "Song or audio file not found/invalid"}, status=status.HTTP_404_NOT_FOUND)
            file_id = song.audio.grid_id
            if not fs.exists(file_id):
                return Response({"error": "Audio file not found in storage"}, status=status.HTTP_404_NOT_FOUND)
            grid_file = fs.get(file_id)
            response = StreamingHttpResponse(grid_file, content_type=grid_file.content_type or "audio/mpeg")
            response["Content-Disposition"] = f'inline; filename="{getattr(grid_file, "filename", song.title + ".mp3")}"'
            response["Content-Length"] = grid_file.length
            return response
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SongVideoView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, song_id):
        try:
            song = Song.findById(ObjectId(song_id))
            if not song or not song.video or not hasattr(song.video, 'grid_id') or not song.video.grid_id:
                return Response({"error": "Song or video file not found/invalid"}, status=status.HTTP_404_NOT_FOUND)
            file_id = song.video.grid_id
            if not fs.exists(file_id):
                return Response({"error": "Video file not found in storage"}, status=status.HTTP_404_NOT_FOUND)
            grid_file = fs.get(file_id)
            response = StreamingHttpResponse(grid_file, content_type=grid_file.content_type or "video/mp4")
            response["Content-Disposition"] = f'inline; filename="{getattr(grid_file, "filename", song.title + ".mp4")}"'
            response["Content-Length"] = grid_file.length
            return response
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SongCoverView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, song_id):
        try:
            song = Song.findById(ObjectId(song_id))
            if not song or not song.cover or not hasattr(song.cover, 'grid_id') or not song.cover.grid_id:
                return Response({"error": "Song or cover image not found/invalid"}, status=status.HTTP_404_NOT_FOUND)
            file_id = song.cover.grid_id
            if not fs.exists(file_id):
                return Response({"error": "Cover image not found in storage"}, status=status.HTTP_404_NOT_FOUND)
            grid_file = fs.get(file_id)
            response = HttpResponse(grid_file.read(), content_type=grid_file.content_type or "image/jpeg")
            return response
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SongCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated] # Chỉ user đã đăng nhập mới được tạo

    def post(self, request):
        # Truyền request vào context của serializer để nó có thể access request.user
        serializer = SongCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # .save() của serializer sẽ gọi đến .create() của serializer
            song_instance = serializer.save() # Giờ đây .save() sẽ trả về Song instance
            
            # Serialize lại bằng EnhancedSongSerializer để trả về đầy đủ URL media
            response_serializer = EnhancedSongSerializer(song_instance, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SongBulkDestroyView(APIView):
    permission_classes = [AllowAny] # Hoặc IsAdminUser nếu chỉ admin được xóa nhiều
    http_method_names = ['post', 'options'] # DRF mặc định không cho 'delete' với body

    def post(self, request): # Đổi thành post để nhận list IDs từ body
        song_ids_str = request.data.get("song_ids", [])

        if not isinstance(song_ids_str, list):
            return Response(
                {"error": "Invalid data format. 'song_ids' must be a list of strings."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not song_ids_str:
            return Response(
                {"error": "No song IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        song_object_ids = []
        for sid_str in song_ids_str:
            try:
                song_object_ids.append(ObjectId(sid_str))
            except:
                return Response({"error": f"Invalid song ID format: {sid_str}"}, status=status.HTTP_400_BAD_REQUEST)

        # Gọi hàm delete_many từ model Song
        num_deleted = Song.delete_many(song_object_ids) # Giả sử delete_many trả về số lượng đã xóa
        
        if num_deleted > 0:
            return Response(
                {"message": f"{num_deleted} songs soft-deleted successfully"},
                status=status.HTTP_200_OK, # Hoặc 204 nếu không có content trả về
            )
        else:
            return Response(
                {"error": "No songs found for the provided IDs or they were already deleted"},
                status=status.HTTP_404_NOT_FOUND,
            )

class SongSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("query", "").strip()
        search_type = request.query_params.get("type", "All").strip()

        if not query: # Nếu query rỗng, có thể trả về list rỗng hoặc không làm gì cả
            return Response({"songs": [], "users": [], "playlists": []}, status=status.HTTP_200_OK)

        try:
            response_data = {}

            if search_type == "All" or search_type == "Songs":
                songs_qs = Song.search(query) # Giả sử search trả về QuerySet
                # Paginate nếu cần
                song_serializer = EnhancedSongSerializer(songs_qs, many=True, context={"request": request})
                response_data["songs"] = song_serializer.data

            if search_type == "All" or search_type == "Users":
                users_qs = User.search(query) # Giả sử User model có hàm search
                user_data = []
                for user_obj in users_qs:
                    user_songs_qs = Song.objects.filter(user=user_obj, deleted_at=None)
                    # UserDetailSerializer có thể phù hợp hơn UserListSerializer ở đây
                    user_serializer = UserDetailSerializer(user_obj, context={"request": request})
                    song_serializer = EnhancedSongSerializer(user_songs_qs, many=True, context={"request": request})
                    user_data.append(
                        {"user": user_serializer.data, "songs": song_serializer.data}
                    )
                response_data["users"] = user_data
            
            # Tương tự cho Playlists nếu có
            # if search_type == "All" or search_type == "Playlists":
            #     playlists = Playlist.search(query)
            #     playlist_serializer = PlaylistSerializer(playlists, many=True, context={"request": request})
            #     response_data["playlists"] = playlist_serializer.data

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log lỗi ở đây
            # print(f"Error during song search: {e}")
            return Response({"error": "An error occurred during search.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TopListenedSongsView(APIView):
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        pipeline = [
            {'$group': {'_id': '$song', 'total_listens': {'$sum': 1}}},
            {'$sort': {'total_listens': -1}},
            {'$lookup': {
                'from': Song._get_collection_name(), # Lấy tên collection động từ model
                'localField': '_id', # Đây là ObjectId của song từ listened_at
                'foreignField': '_id', # Đây là _id của song trong songs collection
                'as': 'song_details_array' # Đổi tên để tránh nhầm lẫn
            }},
            {'$unwind': '$song_details_array'}, # $lookup trả về array, cần $unwind
            {'$match': {'song_details_array.deleted_at': None}}, # Chỉ lấy bài hát chưa bị xóa
            {'$project': {
                'song_id': '$song_details_array._id', # Lấy _id từ song_details_array
                'total_listens': 1,
                '_id': 0 # Bỏ _id của group
            }}
        ]
        
        top_listened_aggregated_data = list(ListenedAt.objects.aggregate(*pipeline))

        paginator = self.pagination_class()
        page_data = paginator.paginate_queryset(top_listened_aggregated_data, request, view=self)
        
        results_data = []
        for item in page_data:
            try:
                # item['song_id'] ở đây là ObjectId từ aggregation
                song_obj = Song.objects.get(id=item['song_id']) 
                
                # Sử dụng SongWithOverallStatsSerializer và truyền total_listens qua context
                # Hoặc nếu SongWithOverallStatsSerializer được thiết kế để nhận trực tiếp:
                # serialized_song = SongWithOverallStatsSerializer(
                #     song_obj, 
                #     context={'request': request, 'total_listens': item['total_listens']}
                # ).data
                # results_data.append(serialized_song)

                # Cách khác: Gộp dữ liệu rồi serialize
                # Tạo một dict chứa cả song object và stats
                # data_to_serialize = {
                #     **EnhancedSongSerializer(song_obj, context={'request': request}).data, # unpack song data
                #     'total_listens': item['total_listens']
                # }
                # results_data.append(data_to_serialize)

                # Cách đơn giản nhất: trả về dict có song và count
                results_data.append({
                    'song': EnhancedSongSerializer(song_obj, context={'request': request}).data,
                    'total_listens': item['total_listens']
                })

            except Song.DoesNotExist:
                # print(f"Warning: Song ID {item['song_id']} from aggregation not found in Song collection.")
                continue # Bỏ qua nếu bài hát không còn tồn tại
            except Exception as e:
                # print(f"Error serializing song {item['song_id']}: {e}")
                continue


        return paginator.get_paginated_response(results_data)

class TopDownloadedSongsView(APIView):
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        pipeline = [
            {'$group': {'_id': '$song', 'total_downloads': {'$sum': 1}}},
            {'$sort': {'total_downloads': -1}},
            {'$lookup': {
                'from': Song._get_collection_name(),
                'localField': '_id',
                'foreignField': '_id',
                'as': 'song_details_array'
            }},
            {'$unwind': '$song_details_array'},
            {'$match': {'song_details_array.deleted_at': None}},
            {'$project': {
                'song_id': '$song_details_array._id',
                'total_downloads': 1,
                '_id': 0
            }}
        ]
        top_downloaded_aggregated_data = list(DownloadedAt.objects.aggregate(*pipeline))
        
        paginator = self.pagination_class()
        page_data = paginator.paginate_queryset(top_downloaded_aggregated_data, request, view=self)
        
        results_data = []
        for item in page_data:
            try:
                song_obj = Song.objects.get(id=item['song_id'])
                # serialized_song = SongWithOverallStatsSerializer(
                #     song_obj, 
                #     context={'request': request, 'total_downloads': item['total_downloads']}
                # ).data
                # results_data.append(serialized_song)
                results_data.append({
                    'song': EnhancedSongSerializer(song_obj, context={'request': request}).data,
                    'total_downloads': item['total_downloads']
                })
            except Song.DoesNotExist:
                continue
            except Exception as e:
                continue
                
        return paginator.get_paginated_response(results_data)
