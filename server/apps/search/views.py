from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from utils.convert_objectids_to_str import convert_objectids_to_str
from apps.users.models import User
from apps.songs.models import Song
from apps.albums.models import Album
from apps.playlists.models import Playlist

class SearchAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            query = request.query_params.get("q", "").strip()
            category = request.query_params.get("category", "all").lower()
            if not query: 
                return Response({
                        "results": 
                            {
                                "artists": [], 
                                "songs": [], 
                                "albums": [], 
                                "playlists": []
                            }
                    }, 
                    status=status.HTTP_200_OK)
            
            search_pattern = {"$regex": query, "$options": "i"}
            results = self._search_by_category(category, search_pattern)
            
            return Response({"results": results}, status=status.HTTP_200_OK)
        except Exception as e: 
            print(f"Internal Server Errors: {e}")
            return Response("Internal Server Errors", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _search_by_category(self, category, search_pattern): 
        results = {
            "artists": [],
            "songs": [],
            "albums": [], 
            "playlists": []
        }
        
        if category in ["all", "artists"]:
            results["artists"] = self._search_artists(search_pattern)
        if category in ["all", "songs"]:
            results["songs"] = self._search_songs(search_pattern)
        if category in ["all", "albums"]:
            results["albums"] = self._search_albums(search_pattern)
        if category in ["all", "playlists"]:
            results["playlists"] = self._search_playlists(search_pattern)

        return results
        
    def _search_artists(self, search_pattern): 
        cursor = User.collection.filter({"role": "artist", "username": search_pattern})
        artists = [convert_objectids_to_str(doc) for doc in cursor]
        
        return sorted(artists, key=lambda a: a["username"].lower())
    
    def _search_songs(self, search_pattern): 
        cursor = Song.collection.filter({"title": search_pattern})
        songs = []
        
        for doc in cursor:
            song = convert_objectids_to_str(doc)
            if not isinstance(song, dict):
                continue
            
            artist = User.collection.find_one({"_id": song.get("artist")})
            album = Album.collection.find_one({"_id": song.get("album")})
            song["artist"] = convert_objectids_to_str(artist) if artist else None
            song["album"] = convert_objectids_to_str(album) if album else None
            songs.append(song)
            
        return sorted(songs, key=lambda s: s.get("title", "").lower())
    
    def _search_albums(self, search_pattern): 
        cursor = Album.collection.filter({"name": search_pattern})
        albums = [convert_objectids_to_str(doc) for doc in cursor]
        
        return sorted(albums, key=lambda a: a["name"].lower())
    
    def _search_playlists(self, search_pattern): 
        cursor = Playlist.collection.filter({"name": search_pattern})
        playlists = [convert_objectids_to_str(doc) for doc in cursor]
        
        return sorted(playlists, key=lambda p: p["name"].lower())