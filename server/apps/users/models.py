from mongoengine import Document, StringField, DateTimeField
import datetime


class User(Document):
    name = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    bio = StringField()
    image_url = StringField()
    role = StringField(choices=["admin", "user"], default="user")
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
    deleted_at = DateTimeField()

    meta = {"collection": "users"}
