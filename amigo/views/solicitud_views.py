
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Cliente, Amigo, solicitud_alquiler
from ..serializers.solicitud_alquiler_serializer import solicitud_alquiler
from ..models.solicitud_alquilerDB import solicitud_alquiler
from ..models.calificacionDB import Calificacion
from .utils import calcular_edad
from datetime import date
from datetime import timedelta
from django.db.models import Avg

from django.shortcuts import get_object_or_404
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


def parseDate(year, month, day):
    return year * 365 + month * 30 + day


class EnviarSolicitud(APIView):
    def post(self, request, format=None):
        datos_recibidos = request.data

        required_fields = [
            "cliente_id",
            "amigo_id",
            "lugar",
            "descripcion",
            "fecha_inicio",
            "hora_inicio",
            "duracion",
            "precio",
        ]
        for field in required_fields:
            if field not in datos_recibidos:
                return Response(
                    {"error": f"El campo {field} es requerido"},
                    status=status.HTTP_200_OK,
                )

        # Verificar si el cliente existe
        try:
            cliente = Cliente.objects.get(pk=datos_recibidos["cliente_id"])
        except Cliente.DoesNotExist:
            return Response(
                {"error": "El cliente no existe"}, status=status.HTTP_404_NOT_FOUND
            )

        # Verificar si el amigo existe
        try:
            amigo = Amigo.objects.get(pk=datos_recibidos["amigo_id"])
        except Amigo.DoesNotExist:
            return Response(
                {"error": "El amigo no existe"}, status=status.HTTP_400_BAD_REQUEST
            )
        # Verificar que la duracion sea mayor a cero
        duracion = int(datos_recibidos["duracion"])
        if duracion <= 0:
            return Response(
                {"error": "La duración debe ser mayor a 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Verificar que maximo sea 8 horas
        # duracion_horas = int(datos_recibidos['duracion'])
        if int(datos_recibidos["duracion"]) > 8:
            return Response(
                {"error": "La duración máxima permitida es de 8 horas"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        descripcion = datos_recibidos["descripcion"]
        if len(descripcion) < 30:
            return Response(
                {"error": "La descripción debe tener al menos 30 caracteres"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif len(descripcion) > 500:
            return Response(
                {"error": "La descripción no puede tener más de 500 caracteres"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar que sea fecha valida

        fecha_ini = date.fromisoformat(datos_recibidos["fecha_inicio"])
        today = date.today()

        valido = fecha_ini > today

        if not valido:
            return Response(
                {"error": f"La fecha {fecha_ini} no es válida"},
                status=status.HTTP_404_NOT_FOUND,
            )

        today_14 = today + timedelta(days=14)

        if fecha_ini > today_14:
            return Response(
                {"error": f"La fecha {fecha_ini} no debe pasar los 14 días"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            nueva_solicitud = solicitud_alquiler(
                cliente_id=cliente.cliente_id,
                amigo_id=amigo.amigo_id,
                lugar=datos_recibidos["lugar"],
                descripcion=datos_recibidos["descripcion"],
                fecha_inicio=datos_recibidos["fecha_inicio"],
                hora_inicio=datos_recibidos["hora_inicio"],
                minutos=datos_recibidos["duracion"],
                precio=datos_recibidos["precio"],
                estado_solicitud="E",
            )
            nueva_solicitud.save()
        except Exception as e:
            return Response(
                {f"Ocurrio un error: {e}"}, status=status.HTTP_404_NOT_FOUND
            )

        # Devolver una respuesta correcta
        return Response(
            {"mensaje": "El formulario ha sido enviado correctamente"},
            status=status.HTTP_201_CREATED,
        )


class GetSolicitudesCliente(APIView):
    def get(self, request, cliente_id):
        try:
            cliente = Cliente.objects.get(cliente_id=cliente_id)
            solicitudes = solicitud_alquiler.objects.filter(cliente=cliente)
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        data = {
            "cliente_id": cliente.cliente_id,
            "nombre_completo": f"{cliente.nombre} {cliente.ap_paterno} {cliente.ap_materno}".title(),
            "nombre": cliente.nombre.title(),
            "ap_paterno": cliente.ap_paterno.title(),
            "ap_materno": cliente.ap_materno.title(),
            # "ci": cliente.ci,
            # "fecha_nacimiento": cliente.fecha_nacimiento,
            # "edad": calcular_edad(cliente.fecha_nacimiento),
            # "genero": cliente.genero,
            # "direccion": cliente.direccion,
            # "descripcion": cliente.descripcion,
            # "usuario": cliente.usuario,
            # "correo": cliente.correo,
            # "dinero": cliente.dinero,
            # "estado": cliente.estado,
            # "timestamp_registro": cliente.estado
            "solicitudes": [],
        }

        for solicitud in solicitudes:
            data["solicitudes"].append(
                {
                    "solicitud_alquiler_id": solicitud.solicitud_alquiler_id,
                    "amigo": {
                        "amigo_id": solicitud.amigo.amigo_id,
                        "precio": solicitud.amigo.precio,
                    },
                    "lugar": solicitud.lugar,
                    "descripcion": solicitud.descripcion,
                    "fecha_inicio": solicitud.fecha_inicio,
                    "horas": solicitud.minutos,
                    "precio": solicitud.precio,
                    "estado_solicitud": solicitud.estado_solicitud,
                    # "timestamp_registro": solicitud.timestamp_registro
                }
            )
        return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtenerSolicitudesAmigo(request):
    cliente = get_object_or_404(Cliente, user=request.user)
    data = {"solicitudes_recibidas": []}
    try:
        amigo = Amigo.objects.get(cliente=cliente)
        solicitudes = solicitud_alquiler.objects.filter(
            amigo=amigo, estado_solicitud="E"
        ).order_by("timestamp_registro")
    except Amigo.DoesNotExist:
        # TODO un cliente no deberia entrar a esta solicitud
        return Response(data, status=status.HTTP_200_OK)

    for solicitud in solicitudes:
        nombre_cliente = f"{solicitud.cliente.nombre} {solicitud.cliente.ap_paterno} {solicitud.cliente.ap_materno}".title()
        calificacion_cliente = Calificacion.objects.filter(
            amigo=solicitud.amigo, emisor="cliente"
        ).aggregate(Avg("puntuacion"))["puntuacion__avg"]
        lugar_solicitud = solicitud.lugar
        fecha_solicitud = solicitud.fecha_inicio
        duracion_solicitud = solicitud.minutos
        solicitud_data = {
            "solicitud_alquiler_id": solicitud.solicitud_alquiler_id,
            "nombre_cliente": nombre_cliente,
            "calificacion_cliente": calificacion_cliente,
            "lugar": lugar_solicitud,
            "fecha_inicio": solicitud.fecha_inicio,
            "duracion_minutos": solicitud.minutos,
            "precio": solicitud.precio,
            "estado_solicitud": solicitud.estado_solicitud,
            "amigo_id": solicitud.amigo.amigo_id,
            "cliente": solicitud.cliente.cliente_id,
            "timestamp_registro": solicitud.timestamp_registro,
            "hora_inicio": solicitud.hora_inicio,
        }
        
        data["solicitudes_recibidas"].append(solicitud_data)

    return Response(data)


class AcceptSolicitud(APIView):
    def post(self, request, solicitud_alquiler_id):
        try:
            # Solo aceptar solicitud si esta en estado Enviado
            solicitud = solicitud_alquiler.objects.get(
                pk=solicitud_alquiler_id, estado_solicitud="E"
            )
        except solicitud_alquiler.DoesNotExist:
            return Response(
                {"error": "Solicitud no encontrada o no esta enviada"},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Agregar control para que solo el amigo pueda cambiar la solicitud
        solicitud.estado_solicitud = "A"
        solicitud.save()
        return Response({"mensaje": "Solicitud aceptada correctamente"})


class RechazarSolicitud(APIView):
    def post(self, request, solicitud_alquiler_id):
        try:
            # Solo rechazar solicitud si esta en estado Enviado
            solicitud = solicitud_alquiler.objects.get(
                pk=solicitud_alquiler_id, estado_solicitud="E"
            )
        except solicitud_alquiler.DoesNotExist:
            return Response(
                {"error": "Solicitud no encontrada o no esta enviada"},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Agregar control para que solo el amigo pueda cambiar la solicitud
        solicitud.estado_solicitud = "R"
        solicitud.save()
        return Response({"mensaje": "Solicitud rechazada correctamente"})


class SolicitudAlquilerDetailAPIView(APIView):
    def get(self, request, solicitud_alquiler_id):
        solicitud = get_object_or_404(solicitud_alquiler, pk=solicitud_alquiler_id)
        data = {
            "solicitud_alquiler_id": solicitud.solicitud_alquiler_id,
            "cliente": solicitud.cliente.cliente_id,  # Cambia esto si deseas el nombre del cliente
            "nombre_cliente": f"{solicitud.cliente.nombre} {solicitud.cliente.ap_paterno} {solicitud.cliente.ap_materno}".title(),
            "edad_cliente": calcular_edad(solicitud.cliente.fecha_nacimiento),
            "amigo": solicitud.amigo.amigo_id,  # Cambia esto si deseas el nombre del amigo
            "lugar": solicitud.lugar,
            "descripcion": solicitud.descripcion,
            "fecha_inicio": solicitud.fecha_inicio,
            "hora_inicio": solicitud.hora_inicio.strftime("%H:%M:%S"),
            "minutos": solicitud.minutos,
            "precio": solicitud.precio,
            "estado_solicitud": solicitud.get_estado_solicitud_display(),
            "timestamp_registro": solicitud.timestamp_registro.strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
        }
        return Response(data)

    # dar cliente y amigo , si existen solicitudes enviadas devuelve true sino false


class VerificarSolicitudes(APIView):
    def get(self, request, cliente_idR, amigo_idR):
        try:
            cliente = Cliente.objects.get(cliente_id=cliente_idR)
            amigo = Amigo.objects.get(amigo_id=amigo_idR)
            solicitudes = solicitud_alquiler.objects.filter(
                cliente=cliente, amigo=amigo, estado_solicitud="E"
            )
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        except Amigo.DoesNotExist:
            return Response(
                {"error": "Amigo no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        if solicitudes:
            return Response({"TieneSolicitudes": True})
        else:
            return Response({"TieneSolicitudes": False})
