from rest_framework.serializers import Serializer, CharField
from .models import Genre
from mongoengine import StringField


class GenreSerializer(Serializer):
    id = CharField(read_only=True)
    name = StringField(required=True)
