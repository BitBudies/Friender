
from decouple import config
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from amigo.serializers.cliente_serializer import ClienteSerializer
from ..models import Cliente , ClienteInteres, amigoDB, Amigo
from datetime import date
# filtrar por edad, precio, genero, ubicacion, intereses

    
    
    
    #token
    
# class ClientePorGenero(APIView):
#     def post(self, request):
#         if not request.user.is_authenticated:
#             return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

#         genero = request.data.get('genero')  # Obtiene el género de la solicitud POST
#         if not genero:
#             return Response({"error": "Género no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             cliente = Cliente.objects.get(user=request.user)
#         except ObjectDoesNotExist:
#             return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

#         clientes = Cliente.objects.filter(
#             Q(genero=genero)
#         ).exclude(id=cliente.id).distinct()
#         serializer = ClienteSerializer(clientes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)



class ClientePorGenero(APIView):
    def post(self, request):
        genero = request.data.get('genero')  # Obtiene el género de la solicitud POST
        if not genero:
            return Response({"error": "Género no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        clientes = Cliente.objects.filter(
            Q(genero=genero)
        ).distinct()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    


class ClienteFiltro(APIView):
    def post(self, request):
        genero = request.data.get('genero')  
        edad = request.data.get('edad')  
        direccion = request.data.get('ubicacion')  
        clientes = Cliente.objects.all()
        if genero:
            clientes = clientes.filter(genero=genero)
        if edad:
            fecha_nacimiento_mas_tardia = date.today().replace(year=date.today().year - int(edad))
            fecha_nacimiento_mas_temprana = fecha_nacimiento_mas_tardia.replace(year=fecha_nacimiento_mas_tardia.year - 1)
            clientes = clientes.filter(fecha_nacimiento__gt=fecha_nacimiento_mas_temprana, fecha_nacimiento__lte=fecha_nacimiento_mas_tardia)
        if direccion:
            clientes = clientes.filter(direccion=direccion)

        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class Interes(APIView):
    def post(self, request, *args, **kwargs):
        interes = request.data.get('interes')
        clientes_interes = ClienteInteres.objects.filter(interes__nombre__in=interes)
        clientes = [ci.cliente for ci in clientes_interes]
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

class Precio(APIView):
    def post(self, request, *args, **kwargs):
        precioMin = request.data.get('precio_min')
        precioMax = request.data.get('precio_max')
        precio_amigo = Amigo.objects.filter(precio__range=(precioMin, precioMax))
        clientes = [amigo.cliente for amigo in precio_amigo]
        
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)