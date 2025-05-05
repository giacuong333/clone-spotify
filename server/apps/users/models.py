from mongoengine import (
    Document,
    StringField,
    DateTimeField,
    FileField,
    ValidationError,
    ObjectIdField,
)
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

    @staticmethod
    def create(data):
        try:
            user = User(**data)
            user.save()
            return user
        except ValidationError as e:
            return ValueError(f"Invalid data: {str(e)}")

    @staticmethod
    def findByEmail(email):
        try:
            return User.objects(deleted_at=None, email=email).first()
        except DoesNotExist:
            return None

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return self.deleted_at is None

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)
