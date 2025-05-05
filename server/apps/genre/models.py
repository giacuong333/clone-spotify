from mongoengine import Document, StringField


class Genre(Document):
    name = StringField(required=True)

    meta = {"collection": "genres"}

    def __str__(self):
        return self.name