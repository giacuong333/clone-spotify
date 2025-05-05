from mongoengine import Document, StringField, DateTimeField, FileField
from mongoengine.errors import DoesNotExist
import datetime


class User(Document):
    name = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    bio = StringField()
    image = FileField()
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

    def create_user(name, email, password, bio=None, image=None, role="user"):
        user = User(
            name=name,
            email=email,
            password=password,
            bio=bio,
            image=image,
            role=role,
        )
        user.save()
        return user

    def get_all_users():
        return User.objects(deleted_at=None, role="user")

    @staticmethod
    def get_user_by_id(user_id):
        try:
            return User.objects.get(id=user_id, deleted_at=None)
        except DoesNotExist:
            return None

    def get_user_by_email(self, email):
        try:
            return User.objects.get(email=email, deleted_at=None)
        except DoesNotExist:
            return None

    def update_user(self, user_id, **kwargs):
        user = self.get_user_by_id(user_id)
        if not user:
            return None

        for field, value in kwargs.items():
            if hasattr(user, field):
                setattr(user, field, value)
        user.updated_at = datetime.datetime.now()
        user.save()
        return user

    def delete_user(self, user_id):
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        user.deleted_at = datetime.datetime.now()
        user.save()
        return True
