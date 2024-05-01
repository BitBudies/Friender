from datetime import timedelta
from django.utils import timezone
import random
import string
from amigo.views.utils import correo_valido
from amigo.models.codigosVerificacionDB import Codigos
from amigo.views.utils import generate_key
from ..models.clienteDB import Cliente
from decouple import config
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.mail import send_mail
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


@api_view(["POST"])
def findEmail(request):
    user_or_email = request.POST.get("user_or_email", None)
    if not user_or_email:
        return Response(
            {"error": "El campo es obligatorio"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not correo_valido(user_or_email):
            return Response({"error": "Formato incorrecto ejemplo@dominio.com"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=user_or_email)
    except User.DoesNotExist:
        return Response(
            {"error": "No se encontró una cuenta asociada al email"},
            status=status.HTTP_404_NOT_FOUND,
        )
    
    codigoToken = Codigos.objects.filter(correo=user.email).first()
    if codigoToken:
        tiempo_transcurrido = timezone.now() - codigoToken.timestamp_registro
        if tiempo_transcurrido.total_seconds() < 60:
            tiempo_restante = 60 - int(tiempo_transcurrido.total_seconds())
            return Response(
                {
                    "error": f"Debe esperar {tiempo_restante} segundos para enviar otro correo.",
                    "tiempo": tiempo_restante
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    codigoVerificacion = generate_key(64)

    if codigoToken:
        codigoToken.codigoVerificaion = codigoVerificacion
        codigoToken.timestamp_registro = timezone.now()
    else:
        codigoToken = Codigos(
            correo=user.email,
            codigoVerificaion=codigoVerificacion,
            timestamp_registro=timezone.now(),
        )

    try:
        send_mail(
            "Restablecer contraseña",
            f"Hola {user.username}\nEl enlace para restablecer su contraseña es: https://friender.vercel.app/new-password/{codigoVerificacion}\n expira en 15 min",
            config("EMAIL_HOST_USER"),
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(codigoToken)
    print(codigoToken.codigoVerificaion)
    codigoToken.save()

    return Response({"usuario": user.username}, status=status.HTTP_200_OK)


@api_view(["POST"])
def cambiarContrasena(request):
    print(request.POST)
    tokencito = request.POST.get("tokencito", None)
    nuevaContrasena = request.POST.get("nuevaContrasena", None)
    if not all([tokencito, nuevaContrasena]):
        return Response(
            {"error": "Faltan parametros"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    codigoToken = Codigos.objects.filter(codigoVerificaion=tokencito).first()
    if not codigoToken:
        return Response(
            {"error": "El enlace no es válido o expiró"}, status=status.HTTP_404_NOT_FOUND
        )
    try:
        user = User.objects.get(email=codigoToken.correo)
        codigoToken.delete()
        user.set_password(nuevaContrasena)
        user.save()

    except User.DoesNotExist:
        return Response(
            {"error": "El enlace no es válido o expiró"}, status=status.HTTP_404_NOT_FOUND
        )
    return Response(
        {"message": f"Se restableció correctamente la contraseña"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def enviarCorreoCambioContrasena(request):
    usuario = request.POST.get("usuario", None)
    if not usuario:
        return Response(
            {"error": f"Usuario no encontrado en los parametros"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        usuario = User.objects.get(username=usuario)
    except User.DoesNotExist:
        return Response(
            {"error": "No existe el correo"}, status=status.HTTP_404_NOT_FOUND
        )

    codigoToken = Codigos.objects.filter(correo=usuario.email).first()
    if codigoToken:
        tiempo_transcurrido = timezone.now() - codigoToken.timestamp_registro
        if tiempo_transcurrido.total_seconds() < 60:
            tiempo_restante = 60 - int(tiempo_transcurrido.total_seconds())
            return Response(
                {
                    "error": f"Debe esperar {tiempo_restante} segundos antes de enviar otro codigo."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    codigoVerificaion = "".join(
        random.choices(string.ascii_uppercase + string.digits, k=5)
    )

    if codigoToken:
        codigoToken.codigoVerificaion = codigoVerificaion
        codigoToken.timestamp_registro = timezone.now()
    else:
        codigoToken = Codigos(
            correo=usuario.email,
            codigoVerificaion=codigoVerificaion,
            timestamp_registro=timezone.now(),
        )

    send_mail(
        "Restablecer contraseña",
        f"El codigo para restablecer su contraseña es: {codigoVerificaion}",
        config("EMAIL_HOST_USER"),
        [usuario.email],
        fail_silently=False,
    )

    print(codigoVerificaion)
    codigoToken.save()

    print(f"Se envio correctamente el correo a {usuario.username}")
    return Response(
        {"message": f"Se envio correctamente el correo a {usuario.username}"},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def verificarCodigoToken(request, tokencito):
    if not tokencito:
        return Response(
            {"error": f"El token es necesario"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        codigo = Codigos.objects.filter(codigoVerificaion=tokencito).first()
    except Codigos.DoesNotExist:
        pass
    if not codigo:
        return Response(
            {"error": "El enlace no es válido o expiró"},
            status=status.HTTP_404_NOT_FOUND,
        )

    ahora = timezone.now()
    diferencia = ahora - codigo.timestamp_registro
    tiempo_expiracion = timedelta(minutes=15)

    print(diferencia)
    if diferencia > tiempo_expiracion:
        # Borrar el código
        codigo.delete()
        return Response(
            {"error": "El enlace no es válido o expiró"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    print(codigo)
    return Response({"message": f"El tokencito es correcto"}, status=status.HTTP_200_OK)
