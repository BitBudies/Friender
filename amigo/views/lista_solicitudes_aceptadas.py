from django.http import JsonResponse
from ..models import Calificacion
from ..models import solicitud_alquiler, Cliente, Amigo
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.db.models import F
import base64
from amigo.models.fotografiaDB import Fotografia
from django.db.models import ExpressionWrapper, DateTimeField

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ObtenerListaDeSolicitudes(request):
    user = request.user
    amigo = get_object_or_404(Amigo, cliente__user=user)
    solicitudes_aceptadas = solicitud_alquiler.objects.filter(amigo=amigo, estado_solicitud='A')

    now = datetime.now()
    solicitudes_ordenadas = solicitudes_aceptadas.annotate(
        fecha_hora_inicio=ExpressionWrapper(
            F('fecha_inicio') + F('hora_inicio'),
            output_field=DateTimeField()
        )
    ).order_by('fecha_hora_inicio')

    data = []
    for solicitud in solicitudes_ordenadas:
        if solicitud.fecha_inicio > now.date() or (solicitud.fecha_inicio == now.date() and solicitud.hora_inicio > now.time()):
            calificacion_cliente = Calificacion.objects.filter(cliente=solicitud.cliente).first()
            primera_imagen = obtener_primera_imagen_cliente(amigo.cliente)
            solicitud_info = {
                'nombre_cliente': solicitud.cliente.nombre,
                'calificacion_cliente': calificacion_cliente.puntuacion if calificacion_cliente else 0,
                'lugar': solicitud.lugar,
                'fecha_inicio': solicitud.fecha_inicio,
                'duracion': solicitud.minutos,
                'hora_inicio': solicitud.hora_inicio,
                'imagenBase64': primera_imagen["imagenBase64"] if primera_imagen else None
            }
            data.append(solicitud_info)

    return JsonResponse(data, safe=False)

def obtener_primera_imagen_cliente(cliente):
    fotografia_primera = Fotografia.objects.filter(cliente=cliente, estado_fotografia='F').order_by('prioridad').first()
    if fotografia_primera:
        imagenBase64 = None
        if fotografia_primera.imagenBase64:
            imagenBase64 = base64.b64encode(fotografia_primera.imagenBase64).decode("utf-8")
        return {
            "imagenBase64": imagenBase64,
            "prioridad": fotografia_primera.prioridad
        }
    return None

