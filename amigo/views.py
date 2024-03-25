#from django.shortcuts import render
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente, Amigo, solicitud_alquiler
from .serializers.cliente_serializer import ClienteSerializer
from .serializers.amigo_serializer import AmigoSerializer
from .serializers.solicitud_alquiler_serializer import solicitud_alquiler
from rest_framework import viewsets
from .models.solicitud_alquilerDB import solicitud_alquiler
from .serializers.solicitud_alquiler_serializer import SolicitudAlquilerSerializer
from datetime import date

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
            return Response({"error": "El límite debe ser mayor que 0"}, status=status.HTTP_400_BAD_REQUEST)
        elif limite > 50:
            return Response({"error": "El límite no puede ser mayor que 50"}, status=status.HTTP_400_BAD_REQUEST)
        elif page_number <= 0:
            return Response({"error": "La pagina tiene que ser mayor a 0"}, status=status.HTTP_400_BAD_REQUEST)

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
        }
        return Response(data)

class AmigoListLimitPaginator(APIView):
    def get(self, request, page_number = 1, limite=10):
        if limite <= 0:
            return Response({"error": "El límite debe ser mayor que 0"}, status=status.HTTP_400_BAD_REQUEST)
        elif limite > 50:
            return Response({"error": "El límite no puede ser mayor que 50"}, status=status.HTTP_400_BAD_REQUEST)
        elif page_number <= 0:
            return Response({"error": "La pagina tiene que ser mayor a 0"}, status=status.HTTP_400_BAD_REQUEST)

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
            }
            data["amigos"].append(amigo_data)
        return Response(data)

class SolicitudViewSet(viewsets.ModelViewSet):    #ver si al kevin le gusta los viewsets
    queryset = solicitud_alquiler.objects.all()
    serializer_class = SolicitudAlquilerSerializer