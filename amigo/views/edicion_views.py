import random
import string
from ..models.clienteDB import Cliente
from decouple import config
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.mail import send_mail
from rest_framework.response import Response
from django.contrib.auth.models import User


@api_view(["POST"])
def findEmail(request):
    correo = request.POST.get("correo", None)
    if not correo:
        return Response(
            {"error": "Correo no encontrado en los parametros"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(email=correo)
    except User.DoesNotExist:
        return Response(
            {"error": "Correo no encontrado en la base de datos"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response({"usuario": f"{user.username}"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def cambiarContrasena(request):
    correo = request.POST.get("correo", None)
    codigo = request.POST.get("codigo", None)
    nuevaContrasena = request.POST.get("nuevaContrasena", None)
    if not all([correo, codigo, nuevaContrasena]):
        return Response(
            {"error": "Faltan parametros"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        cliente = Cliente.objects.get(correo=correo, codigoVerificaion=codigo)
        user = cliente.user
        user.set_password(nuevaContrasena)
        user.save()
        cliente.codigoVerificaion = None
        cliente.save()

    except Cliente.DoesNotExist:
        return Response(
            {"error": "Credenciales no validas"}, status=status.HTTP_404_NOT_FOUND
        )
    return Response(
        {"message": f"Se establecio correctamente la contrasena de {cliente.user}"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def enviarCorreoCambioContrasena(request):
    correo = request.POST.get("correo", None)
    if not correo:
        return Response(
            {"error": f"Correo no encontrado en los parametros"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        codigoVerificaion = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=5)
        )
        cliente = Cliente.objects.get(correo=correo)

        send_mail(
            "Restablecer contraseña",
            f"El codigo para restablecer su contraseña es: {codigoVerificaion}",
            config("EMAIL_HOST_USER"),
            [correo],
            fail_silently=False,
        )
        cliente.codigoVerificaion = codigoVerificaion
        cliente.save()

    except Cliente.DoesNotExist:
        return Response(
            {"error": "No existe el correo"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print(f"Se envio correctamente el correo a {cliente.user}")
    return Response(
        {"message": f"Se envio correctamente el correo a {cliente.user}"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def verificarCodigoCambioContrasena(request):
    for field in ["correo", "codigo"]:
        if field not in request.POST:
            return Response(
                {"error": f"{field} no encontrado en el body"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    try:
        Cliente.objects.get(
            correo=request.POST["correo"], codigoVerificaion=request.POST["codigo"]
        )
    except Cliente.DoesNotExist:
        return Response(
            {"error": "El codigo no es correcto o expiro"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response({"message": f"El codigo es correcto"}, status=status.HTTP_200_OK)
