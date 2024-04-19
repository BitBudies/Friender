from django.http import JsonResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from ..models.clienteDB import Cliente

@csrf_exempt
def findEmail(request):
    if request.method == 'POST':
        for field in ['correo']:
            if field not in request.POST:
                return JsonResponse({"error": f"{field} no encontrado en los datos"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cliente = Cliente.objects.get(correo=request.POST['correo'])
        except Cliente.DoesNotExist:
            return JsonResponse({"error": "Correo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        print(f"hola")
        return JsonResponse({"usuario": f"{cliente.usuario}"}, status=status.HTTP_200_OK)
    return JsonResponse({'error': 'Metodo no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
def cambiarContrasena(request):
    if request.method == 'POST':
        for field in ['correo', 'codigo', 'nuevaContrasena']:
            if field not in request.POST:
                return JsonResponse({"error": f"{field} no encontrado en el body"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cliente = Cliente.objects.get(correo=request.POST['correo'], codigoVerificaion=request.POST['codigo'])
            cliente.contrasena = make_password(request.POST["nuevaContrasena"])
            cliente.save()
        except Cliente.DoesNotExist:
            return JsonResponse({"error": "Credenciales no validas"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"message": f"Se establecio correctamente la contrasena de {cliente.usuario}"}, status=status.HTTP_200_OK)
    return JsonResponse({'error': 'Metodo no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
