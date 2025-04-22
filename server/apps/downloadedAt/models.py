from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class DownloadedAt:
    collection = MongoDBManager("downloaded_at")

    @staticmethod
    def create(user_id, song_id):
        return DownloadedAt.collection.create({
            "user": ObjectId(user_id),
            "song": ObjectId(song_id),
            "downloaded_at": datetime.now()
        })