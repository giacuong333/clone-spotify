from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class Playlist:
    collection = MongoDBManager("playlists")

    @staticmethod
    def create(name, cover_url, is_favorite, desc, user_id, songs):
        return Playlist.collection.create({
            "name": name,
            "cover_url": cover_url,
            "is_favorite": is_favorite,
            "desc": desc,
            "user": ObjectId(user_id),
            "songs": [{"song": ObjectId(song), "added_at": datetime.now()} for song in songs],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })