from apps.users.serializers import UserDisplaySerializer
from apps.chat.models import Conversation, Message
from rest_framework import serializers

class ConversationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    participants = serializers.SerializerMethodField()
    updated_at = serializers.DateTimeField()
    last_message = serializers.SerializerMethodField()
    
    def get_participants(self, obj):
        return UserDisplaySerializer(obj.participants, many=True).data
        
    def get_last_message(self, obj):
        message = Message.objects(conversation=obj).order_by('-timestamp').first()
        if message:
            return {
                'content': message.content,
                'timestamp': message.timestamp,
                'sender': str(message.sender.id)
            }
        return None

class MessageSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    sender = serializers.SerializerMethodField()
    content = serializers.CharField()
    timestamp = serializers.DateTimeField()
    is_read = serializers.BooleanField()
    
    def get_sender(self, obj):
        return {
            'id': str(obj.sender.id),
            'name': obj.sender.name
        }