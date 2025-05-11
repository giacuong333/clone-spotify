from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    DateTimeField,
    FileField,
    ListField,
    DoesNotExist,
    BooleanField,
    EmbeddedDocumentField,
    EmbeddedDocument,
    ValidationError,
)
from apps.users.models import User
from apps.songs.models import Song
from datetime import datetime


class SongsOfPlaylist(EmbeddedDocument):
    song = ReferenceField(Song, required=True)
    added_at = DateTimeField(dafault=datetime.now)


class Playlist(Document):
    user = ReferenceField(User, required=True)
    name = StringField(required=True)
    cover = FileField()
    is_favorite = BooleanField(default=False)
    desc = StringField()
    songs = ListField(EmbeddedDocumentField(SongsOfPlaylist))
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    meta = {"collection": "playlists"}

    @staticmethod
    def create(data):
        try:
            playlist = Playlist(**data)
            playlist.save()
            return playlist
        except (ValidationError, ValueError) as e:
            return ValueError({"Error: ", str(e)})

    @staticmethod
    def findAll(user_id):
        try:
            return Playlist.objects(user=user_id)
        except DoesNotExist:
            return None

    @staticmethod
    def findById(playlist_id):
        try:
            return Playlist.objects.get(id=playlist_id)
        except DoesNotExist:
            return None

    @staticmethod
    def addSongToPlayList(playlist_id, song_id):
        try:
            playlist = Playlist.findById(playlist_id)
            song = Song.findById(song_id)
            if not playlist or not song:
                return None
            song_entry = SongsOfPlaylist(song=song, added_at=datetime.now())
            playlist.songs.append(song_entry)
            playlist.updated_at = datetime.now()
            playlist.save()
            return playlist
        except DoesNotExist:
            return None
        
    @staticmethod
    def removeSongFromPlayList(playlist_id, song_id):
        try:
            playlist = Playlist.findById(playlist_id)
            if not playlist:
                return None
            for song_entry in playlist.songs:
                if str(song_entry.song.id) == str(song_id):
                    playlist.songs.remove(song_entry)
                    playlist.updated_at = datetime.now()
                    playlist.save()
                    return playlist
            return None
        except DoesNotExist:
            return None

    @staticmethod
    def delete(playlist_id):
        try:
            playlist = Playlist.objects(id=playlist_id)
            if not playlist:
                return False
            playlist.delete()
            return True
        except DoesNotExist:
            return False

    @staticmethod
    def update(playlist_id, data):
        try:
            playlist = Playlist.findById(id=playlist_id)
            if not playlist:
                return None
            for key, value in data.items():
                setattr(playlist, key, value)
            playlist.updated_at = datetime.now()
            playlist.save()
            return playlist
        except (DoesNotExist, ValidationError) as e:
            return None
