from django.db import models
from apps.users.models import User
from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, ReferenceField, ListField, DictField

# Create your models here.
class Conversation(Document):
    participants = ListField(ReferenceField(User), required=True)
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    meta = {'collection': 'conversations'}

    @classmethod
    def get_or_create(cls, user1_id, user2_id):
        user1 = User.objects.get(id=user1_id)
        user2 = User.objects.get(id=user2_id)

        conversation = cls.objects(participants__all=[user1, user2]).first()
        if not conversation:
            conversation = cls(participants=[user1, user2])
            conversation.save()
        return conversation
    
class Message(Document):
    conversation = ReferenceField(Conversation)
    sender = ReferenceField(User)
    content = StringField(required=True)
    timestamp = DateTimeField(default=datetime.now)
    is_read = models.BooleanField(default=False)

    meta = {'collection': 'messages'}