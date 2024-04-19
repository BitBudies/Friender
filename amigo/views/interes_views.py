from django.http import JsonResponse
from amigo.models.interes import Interes

def obtenerIntereses(request):
    if request.method == 'GET':
        intereses = Interes.objects.all()
        intereses_data = [{'interes_id': interes.interes_id,
                           'nombre': interes.nombre,
                           'descripcion': interes.descripcion,
                           'estado': interes.estado,
                           'timestamp_interes': interes.timestamp_interes} 
                          for interes in intereses]
        
        return JsonResponse({'intereses': intereses_data})
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
