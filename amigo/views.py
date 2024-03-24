#from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente, Amigo
from .serializers.cliente_serializer import ClienteSerializer
from .serializers.amigo_serializer import AmigoSerializer


#class endpoint(APIView):
#    def get(self, request):
#        return Response({'mesage': 'Al kevin le gustan los endPoints'})

class ClienteDetailById(APIView):
    def get(self, request, cliente_id):
        try:
            cliente = Cliente.objects.get(cliente_id=cliente_id)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        data = {
            "cliente_id": cliente.cliente_id,
            "nombre": cliente.nombre,
            "ap_paterno": cliente.ap_paterno,
            "ap_materno": cliente.ap_materno,
            "ci": cliente.ci,
            "fecha_nacimiento": cliente.fecha_nacimiento,
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

class ClienteListLimit(APIView):
    def get(self, request, limite=10):
        if limite <= 0:
            return Response({"error": "El límite debe ser mayor que 0"}, status=status.HTTP_400_BAD_REQUEST)
        elif limite > 50:
            return Response({"error": "El límite no puede ser mayor que 50"}, status=status.HTTP_400_BAD_REQUEST)

        # por ahora ordenados por su id
        clientes = Cliente.objects.order_by('cliente_id')[:limite]
        data = []
        for cliente in clientes:
            cliente_data = {
                "cliente_id": cliente.cliente_id,
                "nombre": cliente.nombre,
                "ap_paterno": cliente.ap_paterno,
                "ap_materno": cliente.ap_materno,
                "fecha_nacimiento": cliente.fecha_nacimiento,
                "genero": cliente.genero,
                "descripcion": cliente.descripcion,
                "dinero": cliente.dinero,
                "estado_cliente": cliente.estado,
            }
            data.append(cliente_data)
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
            "nombre": amigo.cliente.nombre,
            "ap_paterno": amigo.cliente.ap_paterno,
            "ap_materno": amigo.cliente.ap_materno,
            "ci": amigo.cliente.ci,
            "fecha_nacimiento": amigo.cliente.fecha_nacimiento,
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
    
class AmigoListLimit(APIView):
    def get(self, request, limite=10):
        if limite <= 0:
            return Response({"error": "El límite debe ser mayor que 0"}, status=status.HTTP_400_BAD_REQUEST)
        elif limite > 50:
            return Response({"error": "El límite no puede ser mayor que 50"}, status=status.HTTP_400_BAD_REQUEST)

        # por ahora ordenados por su id
        amigos = Amigo.objects.order_by('amigo_id')[:limite]
        data = []
        for amigo in amigos:
            amigo_data = {
                "amigo_id": amigo.amigo_id,
                "precio_amigo": amigo.precio,
                "nombre": amigo.cliente.nombre,
                "ap_paterno": amigo.cliente.ap_paterno,
                "ap_materno": amigo.cliente.ap_materno,
                "fecha_nacimiento": amigo.cliente.fecha_nacimiento,
                "genero": amigo.cliente.genero,
                "direccion": amigo.cliente.direccion,
                "descripcion": amigo.cliente.descripcion,
                "estado_amigo": amigo.estado,
            }
            data.append(amigo_data)
        return Response(data)
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)

class ClienteListView(APIView):
    def get(self, request, limite):
        try:
            limite = int(limite)
            if limite <= 0:
                raise ValueError
        except ValueError:
            return Response(
                {"error": "Invalid limit"},
                status=status.HTTP_400_BAD_REQUEST
            )
        clientes = Cliente.objects.all()[:limite]  # Obtener los clientes con el limite
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

class AmigoListAPIView(APIView):
    def get(self, request, amigo_id):
        try:
            amigo = Amigo.objects.get(amigo_id=amigo_id)
        except Amigo.DoesNotExist:
            return Response({"error": "Amigo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AmigoSerializer(amigo)
        return Response(serializer.data)
