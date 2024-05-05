import json

from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse, JsonResponse

from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import ChatSerializer

from .models import *
from .responses.gemini import ask_gemini
from .responses.gpt import ask_openai
# from .utils import encrypt_data, decrypt_data
# from core.settings import ENCRYPTION_KEY
# Create your views here.


def service_worker (request):
    sw_path = loader.get_template("sw.js")
    response = HttpResponse(sw_path.render(), content_type='application/javascript')
    return response


def initiate_chat(request):
    if request.method == 'POST':
        userquery_data = json.loads(request.body)
        # print(data)
        message = userquery_data.get('message')
        chatId = userquery_data.get('chatId')
        text = "Response Encrypted"
        # print(message)
        # print(chatId)
        # print(ENCRYPTION_KEY)
        if Chat.objects.filter(chat_id = chatId).exists():
                cont = Chat.objects.get(chat_id = chatId)
                cont.conversation.append(f"{message}")
                chats = ask_gemini(message)
                cont.conversation.append(chats)
                cont = cont.save()
                # chats_encrypt = encrypt_data(chats, ENCRYPTION_KEY)

                return JsonResponse({'message':message, 'chats': chats})
                # if chats_encrypt:
                #         chats_decrypt = decrypt_data(chats_encrypt, ENCRYPTION_KEY)
                #         print(chats_decrypt)
                # else:
                #         return JsonResponse({'message':message, 'chats':text})
        else:
                chats = ask_gemini(message)
                chat_is_new = Chat.objects.create(
                        chat_id=chatId, 
                        conversation=[f"{message}", f"{chats}"]
                )
                # chats_encrypt = encrypt_data(chats, ENCRYPTION_KEY)
                return JsonResponse({'message':message, 'chats':chats})
                # if chats_encrypt:
                #         chats_decrypt = decrypt_data(chats_encrypt, ENCRYPTION_KEY)
                #         print(chats_decrypt)
                # else:
                #         return JsonResponse({'message':message, 'chats':text})


def chats(request):      
        return render(request, 'main/main.html')


class ChatViewSet(viewsets.ViewSet):
    def create(self, request):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.validated_data.get('message')
            chatId = serializer.validated_data.get('chatId')

            text = "Response Encrypted"
            if Chat.objects.filter(chat_id=chatId).exists():
                cont = Chat.objects.get(chat_id=chatId)
                cont.conversation.append(f"{message}")
                chats = ask_gemini(message)
                cont.conversation.append(chats)
                cont.save()
            else:
                chats = ask_gemini(message)
                chat_is_new = Chat.objects.create(
                    chat_id=chatId,
                    conversation=[f"{message}", f"{chats}"]
                )
            
            return Response({'message': message, 'chats': chats}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





