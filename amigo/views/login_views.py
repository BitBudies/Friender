from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Cliente
from ..serializers.login_serializer import LoginSerializer
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def LoginView(request):
    if request.method == 'POST':
        for field in ['usuario', 'contrasena']:
            if field not in request.POST:
                print(f"{field} no encontrado en el body")
                return JsonResponse({"error": f"{field} no encontrado en el body"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cliente = Cliente.objects.get(usuario=request.POST['usuario'])
            if check_password(request.POST['contrasena'], cliente.contrasena):
                return JsonResponse({"id": cliente.cliente_id}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"id": "0"}, status=status.HTTP_200_OK)
        except Cliente.DoesNotExist:
            return JsonResponse({"id": "0"}, status=status.HTTP_200_OK)
    return JsonResponse({'error': 'Metodo no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)