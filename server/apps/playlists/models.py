from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    DateTimeField,
)
from apps.users.models import User
from apps.songs.models import Song
import datetime


class PlaylistSong(EmbeddedDocument):
    song = ReferenceField(Song)
    added_at = DateTimeField(default=datetime.datetime.now)


class Playlist(Document):
    user = ReferenceField(User)
    name = StringField(required=True)
    cover_url = StringField()
    is_favorite = StringField()
    desc = StringField()
    songs = ListField(EmbeddedDocumentField(PlaylistSong))
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
