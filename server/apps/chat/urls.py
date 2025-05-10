from django.urls import path
from apps.chat.views import ConversationListView, MessageListView

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation_list"),
    path(
        "conversations/<str:other_user_id>/messages/",
        MessageListView.as_view(),
        name="message_list",
    ),
]
