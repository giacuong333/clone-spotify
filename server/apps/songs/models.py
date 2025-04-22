from mongodbmanager.models import MongoDBManager
from bson import ObjectId

class Song:
    collection = MongoDBManager("songs")

    @staticmethod
    def create(title, genre, file_url, image_url, released_at, approved_at, deleted_at, user_id, duration):
        return Song.collection.create({
            "title": title,
            "genre": [ObjectId(genre)],
            "file_url": file_url,
            "cover_url": image_url,
            "released_at": released_at,
            "approved_at": approved_at,
            "deleted_at": deleted_at,
            "user": ObjectId(user_id),
            "duration": duration
        })