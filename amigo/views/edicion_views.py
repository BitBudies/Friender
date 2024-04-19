from django.http import JsonResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

from ..models.clienteDB import Cliente

@csrf_exempt
def findEmail(request):
    print(request.POST)
    if request.method == 'POST':
        for field in ['correo']:
            if field not in request.POST:
                return JsonResponse({"error": f"{field} no encontrado en los datos"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cliente = Cliente.objects.get(correo=request.POST['correo'])
        except Cliente.DoesNotExist:
            return JsonResponse({"error": "Correo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        print(f"hola")
        return JsonResponse({"cliente_id": f"{cliente.cliente_id}"}, status=status.HTTP_200_OK)
    return JsonResponse({'error': 'Metodo no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)