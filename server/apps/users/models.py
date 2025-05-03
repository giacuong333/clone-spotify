from mongoengine import Document, StringField, DateTimeField, FileField
from mongoengine.errors import DoesNotExist
import datetime


class User(Document):
    name = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    bio = StringField()
    image_url = FileField()
    role = StringField(choices=["admin", "user"], default="user")
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
    deleted_at = DateTimeField(default=None, null=True)

    meta = {"collection": "users"}

    @staticmethod
    def findAllByRoleUser():
        try:
            return User.objects(deleted_at=None, role="user")
        except DoesNotExist:
            return []
