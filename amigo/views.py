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