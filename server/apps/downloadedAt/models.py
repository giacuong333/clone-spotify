from mongoengine import Document, ReferenceField, DateTimeField
from apps.users.models import User
from apps.songs.models import Song


class DownloadedAt(Document):
    user = ReferenceField(User)
    song = ReferenceField(Song)
    downloaded_at = DateTimeField()
