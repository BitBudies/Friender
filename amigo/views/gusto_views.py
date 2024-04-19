from django.http import JsonResponse
from amigo.models.gusto import Gusto

def obtenerGustos(request):
    if request.method == 'GET':
        gustos = Gusto.objects.all().order_by('nombre')
        gustos_data = [{'gusto_id': gusto.gusto_id,
                        'nombre': gusto.nombre,
                        'descripcion': gusto.descripcion,
                        'estado': gusto.estado,
                        'timestamp_gusto': gusto.timestamp_gusto} 
                       for gusto in gustos]
        return JsonResponse({'gustos': gustos_data}, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)