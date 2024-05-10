from django.http import JsonResponse
from ..models import Calificacion
from ..models import solicitud_alquiler, Cliente, Amigo
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from datetime import datetime
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ObtenerListaDeSolicitudes(request ):
    user = request.user
    amigo = get_object_or_404(Amigo, cliente__user=user)  # Modificado para obtener el amigo del usuario
    solicitudes_aceptadas = solicitud_alquiler.objects.filter(amigo=amigo, estado_solicitud='A')

    data = []
    now = datetime.now()
    for solicitud in solicitudes_aceptadas:
        if solicitud.fecha_inicio > now.date() or (solicitud.fecha_inicio == now.date() and solicitud.hora_inicio > now.time()):
            calificacion_cliente = Calificacion.objects.filter(cliente=solicitud.cliente).first()
            solicitud_info = {
                'cliente': solicitud.cliente.nombre,
                'calificacion': calificacion_cliente.puntuacion if calificacion_cliente else None,
                'fecha': solicitud.fecha_inicio,
                'hora': solicitud.hora_inicio,
                'ubicacion': solicitud.lugar
            }
            data.append(solicitud_info)

    response_data = {'solicitudes': data}

    return JsonResponse(response_data, safe=False)

