from mongoengine import (
    Document,
    StringField,
    FileField,
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
    audio = FileField(required=True)
    video = FileField(required=True)
    cover = FileField(required=True)
    user = ReferenceField(User, required=True, default=None)
    duration = IntField(required=True)
    released_at = DateTimeField(required=True)
    deleted_at = DateTimeField(default=None, null=True)

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
    def delete_many(song_ids):
        try:
            result = Song.objects.filter(id__in=song_ids, deleted_at=None).update(
                deleted_at=datetime.now()
            )
            return result > 0
        except DoesNotExist:
            return False
        
    @staticmethod
    def search(query): 
        try: 
            return Song.objects.filter(title__icontains=query, deleted_at=None)
        except DoesNotExist: 
            return []
