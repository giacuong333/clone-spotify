from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class Favorite:
    collection = MongoDBManager("favorites")

    @staticmethod
    def create(name, user_id, songs=[]):
        return Favorite.collection.create({
            "name": name,
            "user": ObjectId(user_id),
            "songs": [ObjectId(song) for song in songs],
            "added_date": datetime.now()
        })