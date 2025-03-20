from mongodbmanager.models import MongoDBManager
from bson import ObjectId

class Song:
    collection = MongoDBManager("songs")

    @staticmethod
    def create(title, artist_id, album_id, genre, file_url, image_url, released_date, is_proved=False):
        return Song.collection.create({
            "title": title,
            "artist": ObjectId(artist_id),
            "album": ObjectId(album_id),
            "genre": genre,
            "file_url": file_url,
            "image_url": image_url,
            "released_date": released_date,
            "is_proved": is_proved
        })
