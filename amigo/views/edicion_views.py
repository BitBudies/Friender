from django.utils import timezone
import random
import string

from amigo.models.codigosVerificacionDB import Codigos
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
    try:
        user = User.objects.get(email=user_or_email)
    except User.DoesNotExist:
        try:
            user = User.objects.get(username=user_or_email)
        except User.DoesNotExist:
            return Response(
                {"error": "No se encontró una cuenta asociada al email"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
    return Response({"usuario": user.username}, status=status.HTTP_200_OK)


@api_view(["POST"])
def cambiarContrasena(request):
    print(request.POST)
    print("hola")
    usuario = request.POST.get("usuario", None)
    codigo = request.POST.get("codigo", None)
    nuevaContrasena = request.POST.get("nuevaContrasena", None)
    if not all([usuario, codigo, nuevaContrasena]):
        return Response(
            {"error": "Faltan parametros"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(username=usuario)
        #cliente = Cliente.objects.get(correo=correo, codigoVerificaion=codigo)
        codigoToken = Codigos.objects.filter(codigoVerificaion=codigo).first()
        if codigoToken:
            codigoToken.delete()
            user.set_password(nuevaContrasena)
            user.save()
        else:
            return Response(
                {"error": "Credenciales no validas"}, status=status.HTTP_400_BAD_REQUEST
            )

    except Cliente.DoesNotExist:
        return Response(
            {"error": "Credenciales no validas"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Codigos.DoesNotExist:
        return Response(
            {"error": "Ocurrio un problema"}, status=status.HTTP_400_BAD_REQUEST
        )
    return Response(
        {"message": f"Se establecio correctamente la contrasena de {user.username}"},
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
                {"error": f"Debe esperar {tiempo_restante} segundos antes de enviar otro codigo."},
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
            timestamp_registro=timezone.now()
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

@api_view(["POST"])
def verificarCodigoCambioContrasena(request):
    print(request.POST)
    codigo = request.POST.get("codigo")
    usuario = request.POST.get("usuario")
    for field in ["usuario", "codigo"]:
        if field not in request.POST:
            return Response(
                {"error": f"{field} no encontrado en el body"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    print(codigo, usuario)
    try:
        user = User.objects.get(username=usuario)
        print(user.email)
        codigo = Codigos.objects.filter(codigoVerificaion=codigo, correo=user.email).first()
    except User.DoesNotExist:
        pass
    except Codigos.DoesNotExist:
        pass
    print(codigo)
    if not codigo:
        return Response(
            {"error": "El codigo no es correcto o expiro"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response({"message": f"El codigo es correcto"}, status=status.HTTP_200_OK)
