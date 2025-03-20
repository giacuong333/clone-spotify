from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class History:
    collection = MongoDBManager("histories")

    @staticmethod
    def create(user_id, song_id):
        return History.collection.create({
            "user": ObjectId(user_id),
            "song": ObjectId(song_id),
            "played_at": datetime.now()
        })

