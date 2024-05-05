from django.db import models

# Create your models here.
class Chat(models.Model):
    chat_id = models.CharField(max_length=100, unique=True)
    conversation = models.JSONField(blank = True, null = True)

    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.chat_id}: {self.created_at}'