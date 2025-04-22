from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Song
from ..playlists.models import Playlist
from utils.convert_objectids_to_str import convert_objectids_to_str

class GetAllSongs(APIView):
    def get(self, request):
        try:
           cursor = Song.collection.filter({})
           songs = convert_objectids_to_str(list(cursor))
           return Response(songs, status=status.HTTP_200_OK)
        except Exception as e:
            print('Internal Server Errors: ', e)
            return Response('Internal Server Errors', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetAlbumSongs(APIView):
    def get(self, request, album_id):
        try:
            album = Album.collection.find_one({"_id": album_id})
            if not album: 
                return Response({"error": "Album not found"}, status=status.HTTP_404_NOT_FOUND)
            
            song_ids = album.get("songs", [])
            
            cursor = Song.collection.filter({"_id": {"$in": song_ids}})
            songs = convert_objectids_to_str(list(cursor))
            
            return Response(songs, status=status.HTTP_200_OK)
        except Exception as e:
            print('Internal Server Errors: ', e)
            return Response('Internal Server Errors', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetPlaylistSongs(APIView):
    def get(self, request, playlist_id):
        try:
            playlist = Playlist.collection.find_one({"_id": playlist_id})
            if not playlist: 
                return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)
            
            song_ids = playlist.get("songs", [])
            
            cursor = Song.collection.filter({"_id": {"$in": song_ids}})
            songs = convert_objectids_to_str(list(cursor))
            
            return Response(songs, status=status.HTTP_200_OK)
        except Exception as e:
            print('Internal Server Errors: ', e)
            return Response('Internal Server Errors', status=status.HTTP_500_INTERNAL_SERVER_ERROR)