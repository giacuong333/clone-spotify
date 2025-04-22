from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class ListenedAt:
    collection = MongoDBManager("listened_at")

    @staticmethod
    def create(user_id, song_id):
        return ListenedAt.collection.create({
            "user": ObjectId(user_id),
            "song": ObjectId(song_id),
            "listened_at": datetime.now()
        })