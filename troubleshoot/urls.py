from django.urls import path
from .views import *

app_name ="chat"

urlpatterns = [
    path('', chats, name='chats'),
    path('initiate-chat/', initiate_chat, name='initiate-chat'),
]