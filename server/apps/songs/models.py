from mongoengine import (
    Document,
    StringField,
    IntField,
    ListField,
    ReferenceField,
    DateTimeField,
    DoesNotExist,
    ValidationError,
)
from apps.genre.models import Genre
from apps.users.models import User
from datetime import datetime


class Song(Document):
    title = StringField(required=True)
    genre = ListField(ReferenceField(Genre))
    file_url = StringField()
    cover_url = StringField()
    user = ReferenceField(User, required=True, default=None)
    duration = IntField(required=True)
    released_at = DateTimeField()
    approved_at = DateTimeField()
    deleted_at = DateTimeField()

    meta = {"collection": "songs"}

    @staticmethod
    def findAll():
        try:
            return Song.objects(deleted_at=None)
        except DoesNotExist:
            return None

    @staticmethod
    def findById(song_id):
        try:
            return Song.objects.get(id=song_id, deleted_at=None)
        except DoesNotExist:
            return None

    @staticmethod
    def create(data):
        try:
            song = Song(**data)
            song.save()
            return song
        except ValidationError as e:
            return ValueError(f"Invalid data: {str(e)}")

    @staticmethod
    def update(song_id, data):
        pass

    @staticmethod
    def delete(song_id):
        try:
            song = Song.objects.get(id=song_id, deleted_at=None)
            song.deleted_at = datetime.now()
            song.save()
        except DoesNotExist:
            return False
