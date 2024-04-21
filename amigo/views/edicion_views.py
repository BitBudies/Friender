import random
import string
from django.http import JsonResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from ..models.clienteDB import Cliente
from decouple import config
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User

@csrf_exempt
def findEmail(request):
    if request.method == "POST":
        for field in ["correo"]:
            if field not in request.POST:
                return JsonResponse(
                    {"error": f"{field} no encontrado en los datos"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        try:
            user = User.objects.get(email=request.POST["correo"])
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Correo no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        print(f"hola")
        return JsonResponse(
            {"usuario": f"{user.username}"}, status=status.HTTP_200_OK
        )
    return JsonResponse(
        {"error": "Metodo no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def cambiarContrasena(request):
    if request.method == "POST":
        for field in ["correo", "codigo", "nuevaContrasena"]:
            if field not in request.POST:
                return JsonResponse(
                    {"error": f"{field} no encontrado en el body"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        try:
            cliente = Cliente.objects.get(
                correo=request.POST["correo"], codigoVerificaion=request.POST["codigo"]
            )
            cliente.usuario.make_password(request.POST["nuevaContrasena"])
            cliente.codigoVerificaion = None
            cliente.save()
        except Cliente.DoesNotExist:
            return JsonResponse(
                {"error": "Credenciales no validas"}, status=status.HTTP_404_NOT_FOUND
            )
        return JsonResponse(
            {
                "message": f"Se establecio correctamente la contrasena de {cliente.usuario}"
            },
            status=status.HTTP_200_OK,
        )
    return JsonResponse(
        {"error": "Metodo no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@api_view(["POST"])
def enviarCorreoCambioContrasena(request):
    
    for field in ["correo"]:
        if field not in request.POST:
            return JsonResponse(
                {"error": f"{field} no encontrado en el body"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    try:
        codigoVerificaion = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=5)
        )
        cliente = Cliente.objects.get(correo=request.POST["correo"])

        send_mail(
            "Restablecer contraseña",
            f"El codigo para restablecer su contraseña es: {codigoVerificaion}",
            config("EMAIL_HOST_USER"),
            [request.POST["correo"]],
            fail_silently=False,
        )
        cliente.codigoVerificaion = codigoVerificaion
        cliente.save()

    except Cliente.DoesNotExist:
        return JsonResponse(
            {"error": "No existe el correo"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return JsonResponse(
            {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    print(f"Se envio correctamente el correo a {cliente.usuario}")
    return JsonResponse(
        {"message": f"Se envio correctamente el correo a {cliente.usuario}"},
        status=status.HTTP_200_OK,
    )

@api_view(["POST"])
def verificarCodigoCambioContrasena(request):
    for field in ["correo", "codigo"]:
        if field not in request.POST:
            return JsonResponse(
                {"error": f"{field} no encontrado en el body"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    try:
        Cliente.objects.get(
            correo=request.POST["correo"], codigoVerificaion=request.POST["codigo"]
        )
    except Cliente.DoesNotExist:
        return JsonResponse(
            {"error": "El codigo no es correcto o expiro"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return JsonResponse(
        {"message": f"El codigo es correcto"}, status=status.HTTP_200_OK
    )