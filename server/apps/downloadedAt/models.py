from mongoengine import Document, ReferenceField, DateTimeField, ValidationError
from apps.users.models import User
from apps.songs.models import Song


class DownloadedAt(Document):
    user = ReferenceField(User, required=True)
    song = ReferenceField(Song, required=True)
    downloaded_at = DateTimeField(required=True)

    meta = {"collection": "downloaded_at"}

    @staticmethod
    def create(data):
        try:
            downloaded_at = DownloadedAt(**data)
            downloaded_at.save()
            return downloaded_at
        except ValidationError as e:
            raise ValueError(f"Invalid data: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"Failed to save: {str(e)}")
