
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Cliente, Amigo, solicitud_alquiler
from ..serializers.solicitud_alquiler_serializer import solicitud_alquiler
from ..models.solicitud_alquilerDB import solicitud_alquiler
from .utils import calcular_edad


class EnviarSolicitud(APIView):
    def post(self, request, format=None):
        datos_recibidos = request.data

        required_fields = ['cliente_id', 'amigo_id', 'lugar', 'descripcion', 'fecha_inicio', 'hora_inicio', 'duracion']
        for field in required_fields:
            if field not in datos_recibidos:
                return Response({"error": f"El campo {field} es requerido"}, status=status.HTTP_200_OK)
        
        # Verificar si el cliente existe
        try:
            cliente = Cliente.objects.get(pk=datos_recibidos['cliente_id'])
        except Cliente.DoesNotExist:
            return Response({"error": "El cliente no existe"}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar si el amigo existe
        try:
            amigo = Amigo.objects.get(pk=datos_recibidos['amigo_id'])
        except Amigo.DoesNotExist:
            return Response({"error": "El amigo no existe"}, status=status.HTTP_404_NOT_FOUND)

        try:
            nueva_solicitud = solicitud_alquiler(
                cliente_id=cliente.cliente_id,
                amigo_id=amigo.amigo_id,
                lugar=datos_recibidos['lugar'],
                descripcion=datos_recibidos['descripcion'],
                fecha_inicio=datos_recibidos['fecha_inicio'],
                hora_inicio=datos_recibidos['hora_inicio'],
                minutos=datos_recibidos['duracion'],
                estado_solicitud='E'
            )
            nueva_solicitud.save()
        except Exception as e: 
            return Response({f'Ocurrio un error: {e}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Devolver una respuesta correcta
        return Response(
            {"mensaje": "Solicitud de alquiler creada correctamente"}, 
            status=status.HTTP_201_CREATED
        )

class GetSolicitudesCliente(APIView):
    def get(self, request, cliente_id):
        try:
            cliente = Cliente.objects.get(cliente_id=cliente_id)
            solicitudes = solicitud_alquiler.objects.filter(cliente=cliente)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        data = {
            "cliente_id": cliente.cliente_id,
            "nombre_completo": f"{cliente.nombre} {cliente.ap_paterno} {cliente.ap_materno}".title(),
            "nombre": cliente.nombre.title(),
            "ap_paterno": cliente.ap_paterno.title(),
            "ap_materno": cliente.ap_materno.title(),
            #"ci": cliente.ci,
            #"fecha_nacimiento": cliente.fecha_nacimiento,
            #"edad": calcular_edad(cliente.fecha_nacimiento),
            #"genero": cliente.genero,
            #"direccion": cliente.direccion,
            #"descripcion": cliente.descripcion,
            #"usuario": cliente.usuario,
            #"correo": cliente.correo,
            #"dinero": cliente.dinero,
            #"estado": cliente.estado,
            #"timestamp_registro": cliente.estado
            "solicitudes": []
        }

        for solicitud in solicitudes:
            data["solicitudes"].append({
                "solicitud_alquiler_id": solicitud.solicitud_alquiler_id,
                "amigo": {
                    "amigo_id": solicitud.amigo.amigo_id,
                    "precio": solicitud.amigo.precio,
                },
                "lugar": solicitud.lugar,
                "descripcion": solicitud.descripcion,
                "fecha_inicio": solicitud.fecha_inicio,
                "horas": solicitud.minutos,
                "estado_solicitud": solicitud.estado_solicitud,
                #"timestamp_registro": solicitud.timestamp_registro
            })
        return Response(data)

class AcceptSolicitud(APIView):
    def post(self, request, solicitud_alquiler_id):
        try:
            # Solo aceptar solicitud si esta en estado Enviado
            solicitud = solicitud_alquiler.objects.get(pk=solicitud_alquiler_id, estado_solicitud='E')
        except solicitud_alquiler.DoesNotExist:
            return Response({"error": "Solicitud no encontrada o no esta enviada"}, status=status.HTTP_404_NOT_FOUND)
        # Agregar control para que solo el amigo pueda cambiar la solicitud
        solicitud.estado_solicitud = 'A'
        solicitud.save()
        return Response({"mensaje": "Solicitud aceptada correctamente"})
    
class RechazarSolicitud(APIView):
    def post(self, request, solicitud_alquiler_id):
        try:
            # Solo rechazar solicitud si esta en estado Enviado
            solicitud = solicitud_alquiler.objects.get(pk=solicitud_alquiler_id, estado_solicitud='E')
        except solicitud_alquiler.DoesNotExist:
            return Response({"error": "Solicitud no encontrada o no esta enviada"}, status=status.HTTP_404_NOT_FOUND)
        # Agregar control para que solo el amigo pueda cambiar la solicitud
        solicitud.estado_solicitud = 'R'
        solicitud.save()
        return Response({"mensaje": "Solicitud rechazada correctamente"})