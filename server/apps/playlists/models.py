from email.policy import default
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
    meta = {
        'db_alias': 'default',
        'collection': 'playlists'  
    }
    user = ReferenceField(User)
    name = StringField(required=True)
    cover_url = StringField()
    is_favorite = StringField()
    desc = StringField()
    songs = ListField(EmbeddedDocumentField(PlaylistSong), default=list)
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
