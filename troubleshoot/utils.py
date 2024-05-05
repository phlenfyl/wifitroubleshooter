from cryptography.fernet import Fernet
import base64


def encrypt_data(data, secret_key):
  fernet = Fernet(secret_key)
  print(secret_key)
  return base64.b64encode(fernet.encrypt(data.encode()))


def decrypt_data(data, secret_key):
  fernet = Fernet(secret_key)
  print(secret_key)
  return fernet.decrypt(data).decode("utf-8")




#   from cryptography.fernet import Fernet
# from core.settings import ENCRYPTION_KEY

# fernet = Fernet(ENCRYPTION_KEY)

# def encrypt_data(data):
#   return base64.b64encode(fernet.encrypt(data.encode()))


# def decrypt_data(data):
#   return fernet.decrypt(data).decode("utf-8")

