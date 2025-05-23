from django.urls import re_path, include
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<user_id>[^/]+)/(?P<other_user_id>[^/]+)/$", consumers.ChatConsumer.as_asgi()),
]