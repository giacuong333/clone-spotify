from rest_framework import serializers
from .models import Genre
from mongoengine import StringField


class GenreSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # Trường 'id' chỉ đọc
    name = serializers.CharField()  # Trường 'name'

    def create(self, validated_data):
        # Tạo một thể loại mới
        from .models import Genre
        return Genre(**validated_data).save()

    def update(self, instance, validated_data):
        # Cập nhật thể loại hiện có
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
