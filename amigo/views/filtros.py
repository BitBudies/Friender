import base64
import random
import string
from decouple import config
from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from amigo.models.calificacionDB import Calificacion
from amigo.models.clienteInteres import ClienteInteres
from amigo.models.fotografiaDB import Fotografia
from amigo.models.interes import Interes
from amigo.serializers.cliente_serializer import ClienteSerializer
from ..models import Cliente
from ..models import Codigos
from django.core.mail import send_mail
from .utils import correo_valido
from django.utils import timezone

# filtrar por edad, precio, genero, ubicacion

class Filtros(APIView):
    def post(self, request):
        data = request.data
        intereses = data.get('intereses', None)
        edad = data.get('edad', None)
        precio = data.get('precio', None)
        genero = data.get('genero', None)
        ubicacion = data.get('ubicacion', None)
        cliente = Cliente.objects.get(id=request.user.id)
        if intereses:
            clientes = Cliente.objects.filter(
                Q(clienteinteres__interes__nombre__in=intereses) &
                Q(clienteinteres__cliente__edad__gte=edad[0]) &
                Q(clienteinteres__cliente__edad__lte=edad[1]) &
                Q(clienteinteres__cliente__genero=genero) &
                Q(clienteinteres__cliente__ubicacion=ubicacion) &
                Q(clienteinteres__cliente__precio__gte=precio[0]) &
                Q(clienteinteres__cliente__precio__lte=precio[1])
            ).exclude(id=cliente.id).distinct()
        else:
            clientes = Cliente.objects.filter(
                Q(edad__gte=edad[0]) &
                Q(edad__lte=edad[1]) &
                Q(genero=genero) &
                Q(ubicacion=ubicacion) &
                Q(precio__gte=precio[0]) &
                Q(precio__lte=precio[1])
            ).exclude(id=cliente.id).distinct()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
