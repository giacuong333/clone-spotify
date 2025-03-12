from config.mongodb import database 
from datetime import datetime
from bson import ObjectId

class Album:
    def __init__(self, name, cover_url, artist_id, songs=None, release_date=None):
        self.name = str(name)
        self.cover_url = str(cover_url)
        self.artist_id = ObjectId(artist_id) if isinstance(artist_id, str) else artist_id
        self.songs = songs if songs is not None else []
        self.release_date = release_date if release_date else datetime.now()