from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField
from apps.genre.models import Genre


class Song(Document):
    title = StringField(required=True)
    genre = ListField(ReferenceField(Genre))
    file_url = StringField()
    cover_url = StringField()
    released_at = DateTimeField()
    approved_at = DateTimeField()
    deleted_at = DateTimeField()
