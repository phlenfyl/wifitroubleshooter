# from datetime import datetime, timedelta
from rest_framework import serializers
from .models import *


class ChatSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%b %d, %Y", read_only=True)

    class Meta:
        model = Chat
        fields = '__all__'


