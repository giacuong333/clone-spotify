from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.chat.models import Conversation, Message
from apps.chat.serializers import ConversationSerializer, MessageSerializer
from apps.users.models import User

# Create your views here.
class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        conversations = Conversation.objects(participants=user).order_by("-updated_at")
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, other_user_id):
        user = request.user
        user_id = str(user.id)

        # Lấy hoặc tạo cuộc hội thoại giữa hai người dùng
        conversation = Conversation.get_or_create(user_id, other_user_id)

        # Đánh dấu tin nhắn là đã đọc
        Message.objects(
            conversation=conversation, sender__ne=user, is_read=False
        ).update(is_read=True)

        # Lấy tất cả tin nhắn
        messages = Message.objects(conversation=conversation).order_by("timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
