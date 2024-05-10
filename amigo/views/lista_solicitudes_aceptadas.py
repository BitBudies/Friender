from django.http import JsonResponse
from ..models import Calificacion
from ..models import solicitud_alquiler, Cliente, Amigo
from rest_framework.decorators import api_view, authentication_classes, permission_classes
def  ObtenerListaDeSolicitudes(request, amigo_id):
    solicitudes_aceptadas = solicitud_alquiler.objects.filter(amigo_id=amigo_id, estado_solicitud='A')
    data = []
    for solicitud in solicitudes_aceptadas:
        #calificación del cliente
        calificacion_cliente = Calificacion.objects.filter(cliente=solicitud.cliente).first()
        solicitud_info = {
            'cliente': solicitud.cliente.nombre,
            'calificacion': calificacion_cliente.puntuacion if calificacion_cliente else None,
            'fecha': solicitud.fecha_inicio,
            'hora': solicitud.hora_inicio,
            'ubicacion': solicitud.lugar
        }
        data.append(solicitud_info)
    return JsonResponse(data, safe=False)

