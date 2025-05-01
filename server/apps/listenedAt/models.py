from mongoengine import Document, ReferenceField, DateTimeField
from apps.users.models import User
from apps.songs.models import Song


class ListenedAt(Document):
    user = ReferenceField(User)
    song = ReferenceField(Song)
    listened_at = DateTimeField()
