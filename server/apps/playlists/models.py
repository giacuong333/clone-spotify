from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    DateTimeField,
    BooleanField,
)
from apps.users.models import User
from apps.songs.models import Song
import datetime


class PlaylistSong(EmbeddedDocument):
    song = ReferenceField(Song)
    added_at = DateTimeField(default=datetime.datetime.now)


class Playlist(Document):
    meta = {"collection": "playlists"}  # Đặt tên collection khớp với MongoDB
    user = ReferenceField(User)
    name = StringField(required=True)
    cover_url = StringField()
    is_favorite = BooleanField(default=False)  # Thay đổi từ StringField thành BooleanField
    desc = StringField()
    songs = ListField(EmbeddedDocumentField(PlaylistSong))
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
