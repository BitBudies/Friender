from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.db.models import F, ExpressionWrapper, DateTimeField
import base64
from ..models import Calificacion, solicitud_alquiler, Amigo
from amigo.models.fotografiaDB import Fotografia
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ObtenerListaDeSolicitudes(request):
    user = request.user
    amigo = get_object_or_404(Amigo, cliente__user=user)
    solicitudes_aceptadas = solicitud_alquiler.objects.filter(amigo=amigo, estado_solicitud='A').order_by('fecha_inicio')

    now = datetime.now().date()
    data = {"solicitudes_recibidas": []}
    for solicitud in solicitudes_aceptadas:
        diferencia_dias = (solicitud.fecha_inicio - now).days
        if diferencia_dias == 0:
            dias_faltantes = "Hoy"
        else:
            dias_faltantes = f"{diferencia_dias} "
        
        calificacion_cliente = Calificacion.objects.filter(cliente=solicitud.cliente).first()
        imagenes_cliente = obtener_imagenes_cliente(solicitud.cliente)
        solicitud_data = {
            'nombre_cliente': solicitud.cliente.getFullName(),
            'calificacion_cliente': calificacion_cliente.puntuacion if calificacion_cliente else 0,
            'lugar': solicitud.lugar,
            'fecha_inicio': solicitud.fecha_inicio,
            'duracion': solicitud.minutos,
            'precio': solicitud.precio,
            'hora_inicio': solicitud.hora_inicio,
            'dias_faltantes': dias_faltantes,
            'imagenes': imagenes_cliente,
        }
        data["solicitudes_recibidas"].append(solicitud_data)

    return Response(data)

def obtener_imagenes_cliente(cliente):
    imagenes = []
    fotografia_amigo = Fotografia.objects.filter(cliente=cliente, prioridad=0).first()
    if fotografia_amigo:
        imagen_base64 = base64.b64encode(fotografia_amigo.imagenBase64).decode("utf-8")
        imagenes.append({"imagenBase64": imagen_base64})
    return imagenes

