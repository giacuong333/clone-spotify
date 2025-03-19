from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class Playlist:
    collection = MongoDBManager("playlists")

    @staticmethod
    def create(name, user_id, created_at=None, songs=[]):
        return Playlist.collection.create({
            "name": name,
            "user": ObjectId(user_id),
            "created_at": created_at or datetime.now(),
            "songs": [{"song": ObjectId(song), "added_at": datetime.now()} for song in songs]
        })
