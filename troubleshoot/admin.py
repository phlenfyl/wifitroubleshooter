from django.contrib import admin
from .models import *

# Register your models here.


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display_links = ('chat_id',)
    search_fields = ('created_at','conversation')
    list_display = ("chat_id","created_at")
