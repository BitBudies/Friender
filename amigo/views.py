#from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente
from .serializers.clienteserializer import ClienteSerializer

#class endpoint(APIView):
#    def get(self, request):
#        return Response({'mesage': 'Al kevin le gustan los endPoints'})

class ClienteDetailView(APIView):
    def get(self, request, id_cliente):
        try:
            cliente = Cliente.objects.get(id_cliente=id_cliente)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)