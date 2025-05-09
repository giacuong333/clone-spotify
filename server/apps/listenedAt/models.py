from mongoengine import Document, ReferenceField, DateTimeField
from apps.users.models import User
from apps.songs.models import Song


class ListenedAt(Document):
    user = ReferenceField(User)
    song = ReferenceField(Song)
    listened_at = DateTimeField()

    meta = {"collection": "listened_at"}

    @staticmethod
    def create(data):
        try:
            listenedAt = ListenedAt(**data)
            listenedAt.save()
            return listenedAt
        except ValueError as e:
            return ValueError({"Error: ", str(e)})
