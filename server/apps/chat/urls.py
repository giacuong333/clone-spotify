from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListView.as_view(), name='conversation_list'),
    path('conversations/<str:other_user_id>/messages/', views.MessageListView.as_view(), name='message_list'),
]