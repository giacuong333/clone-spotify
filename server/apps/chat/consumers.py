from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from datetime import datetime
from apps.chat.models import Conversation, Message
from apps.users.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the user IDs from the URL route
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.other_user_id = self.scope['url_route']['kwargs']['other_user_id']

        # select name for the room
        user_ids = sorted([self.user_id, self.other_user_id])
        self.room_name = f"chat_{user_ids[0]}_{user_ids[1]}"
        self.room_group_name = f"chat_{user_ids[0]}_{user_ids[1]}"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['senderId']
        receiver_id = data['receiverId']

        message_obj = await self.save_message(sender_id, receiver_id, message)

        # Send Message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_obj.content,
                'sender_id': sender_id,
                'message_id': str(message_obj.id),
                'timestamp': message_obj.timestamp.isoformat(),
            }
        )
    
    # Retrieve from channel layer
    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        message_id = event['message_id']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'senderId': sender_id,
            'messageId': message_id,
            'timestamp': timestamp,
        }))
    
    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        conversation = Conversation.get_or_create(sender_id, receiver_id)
        sender = User.objects.get(id=sender_id)
        message = Message(
            conversation=conversation,
            sender=sender,
            content=message
        )
        message.save()

        conversation.updated_at = datetime.now()
        conversation.save()
        return message
