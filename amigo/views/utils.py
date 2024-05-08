from decouple import config
from django.http import JsonResponse
from django.middleware.csrf import get_token
import re
import string
import random


def obtener_csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrf_token": csrf_token})


def correo_valido(correo):
    regex_correo = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(regex_correo, correo):
        return True
    else:
        return False
    

def generate_key(length):
    characters = string.ascii_letters + string.digits + '-_'
    return ''.join(random.choice(characters) for _ in range(length))

if __name__ == "__main__":
    print(len(generate_key(64)))
    
def contrasena_valida(contrasena):
    if (re.search(r'[A-Z]', contrasena) and
        re.search(r'[a-z]', contrasena) and
        re.search(r'[0-9]', contrasena) and
        re.search(r'[!@#\$%\^&\*\(\)_\+\-\=\[\]\{\}\|;:,<\.>\/\?]', contrasena)):
        return True
    else:
        return False
    
