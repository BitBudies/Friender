from decouple import config
from django.http import JsonResponse
from django.middleware.csrf import get_token
import re


def obtener_csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrf_token": csrf_token})


def correo_valido(correo):
    # regex_correo = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

    regex_correo = r"^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+([.]\w+){1,3}"
    if re.search(regex_correo, correo):
        return True
    else:
        return False
