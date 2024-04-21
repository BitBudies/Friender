from datetime import date
from django.core.mail import send_mail
from django.http import HttpResponse
from decouple import config
from django.http import JsonResponse
from django.middleware.csrf import get_token


def calcular_edad(fecha_nacimiento):
    today = date.today()
    age = today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
    return age

def enviar_correo_prueba(request):
    fecha_nacimiento = date(1990, 5, 15)
    edad = calcular_edad(fecha_nacimiento)
    destinatario = 'jhondeycraft776@gmail.com'
    asunto = 'Prueba de correo electrónico desde Django'
    mensaje = f'Hola,\n\nLa edad calculada a partir de la fecha de nacimiento {fecha_nacimiento} es {edad} años.'
    send_mail(asunto, mensaje, 'personafalsa000@gmail.com', [destinatario])

    return HttpResponse('Correo electrónico enviado correctamente.')



def obtener_csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})