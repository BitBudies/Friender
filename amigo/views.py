#from django.shortcuts import render
from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Cliente, Amigo, solicitud_alquiler, Calificacion 
from .serializers.solicitud_alquiler_serializer import solicitud_alquiler, SolicitudAlquilerSerializer
from rest_framework import viewsets
from .models.solicitud_alquilerDB import solicitud_alquiler
from .serializers.solicitud_alquiler_serializer import SolicitudAlquilerSerializer
from .serializers.login_serializer import LoginSerializer

from datetime import date

#-------------------------------modelos-------------------------------
#class endpoint(APIView):
#    def get(self, request):
#        return Response({'mesage': 'Al kevin le gustan los endPoints'})

def calcular_edad(fecha_nacimiento):
    today = date.today()
    age = today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
    return age

class ClienteDetailById(APIView):
    def get(self, request, cliente_id):
        try:
            cliente = Cliente.objects.get(cliente_id=cliente_id)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        data = {
            "cliente_id": cliente.cliente_id,
            "nombre_completo": f"{cliente.nombre} {cliente.ap_paterno} {cliente.ap_materno}".title(),
            "nombre": cliente.nombre.title(),
            "ap_paterno": cliente.ap_paterno.title(),
            "ap_materno": cliente.ap_materno.title(),
            "ci": cliente.ci,
            "fecha_nacimiento": cliente.fecha_nacimiento,
            "edad": calcular_edad(cliente.fecha_nacimiento),
            "genero": cliente.genero,
            "direccion": cliente.direccion,
            "descripcion": cliente.descripcion,
            "usuario": cliente.usuario,
            "correo": cliente.correo,
            "dinero": cliente.dinero,
            "estado": cliente.estado,
            "timestamp_registro": cliente.estado
        }
        return Response(data)

class ClienteListLimitPaginator(APIView):
    def get(self, request, page_number = 1, limite=10):
        if limite <= 0:
            return Response({"error": "El límite debe ser mayor que 0"}, status=status.HTTP_200_OK)
        elif limite > 50:
            return Response({"error": "El límite no puede ser mayor que 50"}, status=status.HTTP_200_OK)
        elif page_number <= 0:
            return Response({"error": "La pagina tiene que ser mayor a 0"}, status=status.HTTP_200_OK)

        clientes = Cliente.objects.order_by('cliente_id') #ordenamiento temporal
        paginator = Paginator(clientes, limite)

        try:
            page_obj = paginator.page(page_number)
        except Exception:
            return Response({"error": "Página no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "numero_paginas" : paginator.num_pages,
            "numero_clientes_total": clientes.count(),
            "clientes" : []
        }
        for cliente in page_obj:
            cliente_data = {
                "cliente_id": cliente.cliente_id,
                "nombre_completo": f"{cliente.nombre} {cliente.ap_paterno} {cliente.ap_materno}".title(),
                "nombre": cliente.nombre.title(),
                "ap_paterno": cliente.ap_paterno.title(),
                "ap_materno": cliente.ap_materno.title(),
                "fecha_nacimiento": cliente.fecha_nacimiento,
                "edad": calcular_edad(cliente.fecha_nacimiento),
                "genero": cliente.genero,
                "descripcion": cliente.descripcion,
                "dinero": cliente.dinero,
                "estado_cliente": cliente.estado,
            }
            data["clientes"].append(cliente_data)
        return Response(data)

class AmigoDetailById(APIView):
    def get(self, _, amigo_id):
        try:
            amigo = Amigo.objects.get(amigo_id=amigo_id)
        except Amigo.DoesNotExist:
            return Response({"error": "Amigo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        calificaciones_amigo = Calificacion.objects.filter(amigo=amigo, emisor="cliente")
        if not calificaciones_amigo.exists():
            promedio_calificaciones = 0
        else:
            # se calcula el promedio de las puntuaciones
            promedio_calificaciones = calificaciones_amigo.aggregate(Avg('puntuacion'))['puntuacion__avg']
        
        data = {
            "amigo_id": amigo.amigo_id,
            "precio_amigo": amigo.precio,
            "nombre_completo": f"{amigo.cliente.nombre} {amigo.cliente.ap_paterno} {amigo.cliente.ap_materno}".title(),
            "nombre": amigo.cliente.nombre.title(),
            "ap_paterno": amigo.cliente.ap_paterno.title(),
            "ap_materno": amigo.cliente.ap_materno.title(),
            "ci": amigo.cliente.ci,
            "fecha_nacimiento": amigo.cliente.fecha_nacimiento,
            "edad": calcular_edad(amigo.cliente.fecha_nacimiento),
            "genero": amigo.cliente.genero,
            "direccion": amigo.cliente.direccion,
            "descripcion": amigo.cliente.descripcion,
            "usuario": amigo.cliente.usuario,
            "correo": amigo.cliente.correo,
            "dinero_amigo": amigo.dinero,
            "estado_amigo" : amigo.estado,
            "registro_amigo": amigo.timestamp_registro,
            "numero_califiaciiones": calificaciones_amigo.count(),
            "calificacion": promedio_calificaciones
        }
        return Response(data)

class AmigoListLimitPaginator(APIView):
    def get(self, request, page_number = 1, limite=10):
        if limite <= 0:
            return Response({"error": "El límite debe ser mayor que 0"}, status=status.HTTP_200_OK)
        elif limite > 50:
            return Response({"error": "El límite no puede ser mayor que 50"}, status=status.HTTP_200_OK)
        elif page_number <= 0:
            return Response({"error": "La pagina tiene que ser mayor a 0"}, status=status.HTTP_200_OK)

        amigos = Amigo.objects.order_by('amigo_id') #ordenamiento temporal
        paginator = Paginator(amigos, limite)

        try:
            page_obj = paginator.page(page_number)
        except Exception:
            return Response({"error": "Página no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "numero_paginas" : paginator.num_pages,
            "numero_amigos_total": amigos.count(),
            "amigos" : []
        }
        for amigo in page_obj:
            calificaciones_amigo = Calificacion.objects.filter(amigo=amigo, emisor="cliente")
            if not calificaciones_amigo.exists():
                promedio_calificaciones = 0
            else:
                # se calcula el promedio de las puntuaciones
                promedio_calificaciones = calificaciones_amigo.aggregate(Avg('puntuacion'))['puntuacion__avg']

            amigo_data = {
                "amigo_id": amigo.amigo_id,
                "precio_amigo": amigo.precio,
                "nombre_completo": f"{amigo.cliente.nombre.title()} {amigo.cliente.ap_paterno.title()} {amigo.cliente.ap_materno.title()}",
                "nombre": amigo.cliente.nombre.title(),
                "ap_paterno": amigo.cliente.ap_paterno.title(),
                "ap_materno": amigo.cliente.ap_materno.title(),
                "fecha_nacimiento": amigo.cliente.fecha_nacimiento,
                "edad": calcular_edad(amigo.cliente.fecha_nacimiento),
                "genero": amigo.cliente.genero,
                "direccion": amigo.cliente.direccion,
                "descripcion": amigo.cliente.descripcion,
                "estado_amigo": amigo.estado,
                "numero_califiaciiones": calificaciones_amigo.count(),
                "calificacion": promedio_calificaciones
            }
            data["amigos"].append(amigo_data)
        return Response(data)

class SolicitudViewSet(viewsets.ModelViewSet):    #ver si al kevin le gusta los viewsets
    queryset = solicitud_alquiler.objects.all()
    serializer_class = SolicitudAlquilerSerializer



class LoginView(APIView):
    serializer_class = LoginSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data) 
        if serializer.is_valid():
            try:
                user = Cliente.objects.get(usuario=serializer.data['usuario'])
                if user.contrasena == serializer.data['contrasena']:
                    return Response({"id": user.cliente_id}, status=status.HTTP_200_OK)
                else:
                    return Response({"id": "0"}, status=status.HTTP_404_NOT_FOUND)
            except Cliente.DoesNotExist:
                return Response({"id": "0"}, status=status.HTTP_404_NOT_FOUND)
        else:
            if not serializer.data['usuario'] and not serializer.data['contrasena']:
                return Response({"error":"Campo usuario y contraseña requeridos"}, status=status.HTTP_200_OK)
            if not serializer.data['usuario']: 
                return Response({"error":"Campo usuario requerido"}, status=status.HTTP_200_OK)
            else:
                return Response({"error":"Campo contraseña requerido"}, status=status.HTTP_200_OK)       
        

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
            "edad": calcular_edad(cliente.fecha_nacimiento),
            "genero": cliente.genero,
            "direccion": cliente.direccion,
            "descripcion": cliente.descripcion,
            "usuario": cliente.usuario,
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
                "hora_inicio": solicitud.hora_inicio,
                "minutos": solicitud.minutos,
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
    
class EnviarSolicitud(APIView):
    def post(self, request, format=None):
        datos_recibidos = request.data

        required_fields = ['cliente_id', 'amigo_id', 'lugar', 'descripcion', 'fecha_inicio', 'minutos', 'estado_solicitud']
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
                minutos=datos_recibidos['minutos'],
                estado_solicitud=datos_recibidos['estado_solicitud']
            )
            nueva_solicitud.save()
        except Exception as e: 
            return Response({f'Ocurrio un error: {e}'}, status=status.HTTP_404_NOT_FOUND)
        

        # Devolver una respuesta con los datos de la solicitud creada
        return Response({"mensaje": "Solicitud de alquiler creada correctamente", "datos": {
            "solicitud_alquiler_id": nueva_solicitud.solicitud_alquiler_id,
            "cliente_id": nueva_solicitud.cliente_id,
            "amigo_id": nueva_solicitud.amigo_id,
            "lugar": nueva_solicitud.lugar,
            "descripcion": nueva_solicitud.descripcion,
            "fecha_inicio": nueva_solicitud.fecha_inicio,
            "minutos": nueva_solicitud.minutos,
            "estado_solicitud": nueva_solicitud.estado_solicitud,
            "timestamp_registro": nueva_solicitud.timestamp_registro
        }}, status=status.HTTP_201_CREATED)

