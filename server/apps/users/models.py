from mongoengine import (
    Document,
    StringField,
    DateTimeField,
    FileField,
    ValidationError,
)
from mongoengine.errors import DoesNotExist
import datetime
from mongoengine import Document, StringField, DateTimeField, BooleanField


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
    google_id = StringField()
    is_oauth_user = BooleanField(default=False)

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

    @staticmethod
    def findById(user_id):
        try:
            return User.objects.get(deleted_at=None, id=user_id)
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

    def get_username(self):
        return self.email

    def get_id(self):
        return str(self.id)

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

    @staticmethod
    def search(query):
        if not query or query.strip() == "":
            return User.objects.none()
        return User.objects.filter(name__icontains=query, deleted_at=None, role="user")
