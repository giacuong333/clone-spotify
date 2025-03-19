from mongodbmanager.models import MongoDBManager
from bson import ObjectId

class Album:
    collection = MongoDBManager("albums")

    @staticmethod
    def create(name, artist_id, released_date, cover_url, songs=[]):
        return Album.collection.create({
            "name": name,
            "artist": ObjectId(artist_id),
            "released_date": released_date,
            "cover_url": cover_url,
            "songs": [ObjectId(song) for song in songs]
        })