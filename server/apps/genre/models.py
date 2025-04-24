from mongoengine import Document, StringField


class Genre(Document):
    name = StringField(required=True, unique=True)
