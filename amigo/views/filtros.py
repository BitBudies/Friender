
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from amigo.serializers.cliente_serializer import ClienteSerializer
from ..models import Cliente , ClienteInteres, Amigo
from datetime import date
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
# filtrar por edad, precio, genero, ubicacion, intereses

#por tablas
class ClientePorGenero(APIView):
    def post(self, request):
        genero = request.data.get('genero')  
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
        edadMin = request.data.get('edad_min')  
        edadMax = request.data.get('edad_max')  
        direccion = request.data.get('ubicacion')  
        
        clientes = Cliente.objects.all()
        if genero:
            clientes = clientes.filter(genero=genero)
        if edadMin and edadMax:
            fecha_nacimiento_mas_tardia = date.today().replace(year=date.today().year - int(edadMin))
            fecha_nacimiento_mas_temprana = date.today().replace(year=date.today().year - int(edadMax))
            clientes = clientes.filter(fecha_nacimiento__range=(fecha_nacimiento_mas_temprana, fecha_nacimiento_mas_tardia))
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
#total  
class FiltroTotal(APIView):
    def post(self, request , *args,**kwargs):
        genero = request.data.get('genero')  
        edadMin = request.data.get('edad_min')  
        edadMax = request.data.get('edad_max')  
        direccion = request.data.get('ubicacion')  
        interes = request.data.get('interes')
        precioMin = request.data.get('precio_min')
        precioMax = request.data.get('precio_max')
        clientes = Cliente.objects.all()
        if genero:
            clientes = clientes.filter(genero=genero)
        if edadMin and edadMax:
            fecha_nacimiento_mas_tardia = date.today().replace(year=date.today().year - int(edadMin))
            fecha_nacimiento_mas_temprana = date.today().replace(year=date.today().year - int(edadMax))
            clientes = clientes.filter(fecha_nacimiento__range=(fecha_nacimiento_mas_temprana, fecha_nacimiento_mas_tardia))
        if direccion:
            clientes = clientes.filter(direccion=direccion)
        if interes:
            clientes_interes = ClienteInteres.objects.filter(interes__nombre__in=interes, cliente__in = clientes)
            clientes = [ci.cliente for ci in clientes_interes]
        if precioMin and precioMax:
            precio_amigo = Amigo.objects.filter(precio__range=(precioMin, precioMax), cliente__in = clientes)
            clientes = [amigo.cliente for amigo in precio_amigo]
        
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    
#con tokens ______________________________________________________________________________________
class ClientePorGeneroToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        genero = request.data.get('genero')  
        if not genero:
            return Response({"error": "Género no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        clientes = Cliente.objects.filter(
            Q(genero=genero)
        ).distinct()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ClienteFiltroToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        genero = request.data.get('genero')  
        edadMin = request.data.get('edad_min')  
        edadMax = request.data.get('edad_max')  
        direccion = request.data.get('ubicacion')  
        
        clientes = Cliente.objects.all()
        if genero:
            clientes = clientes.filter(genero=genero)
        if edadMin and edadMax:
            fecha_nacimiento_mas_tardia = date.today().replace(year=date.today().year - int(edadMin))
            fecha_nacimiento_mas_temprana = date.today().replace(year=date.today().year - int(edadMax))
            clientes = clientes.filter(fecha_nacimiento__range=(fecha_nacimiento_mas_temprana, fecha_nacimiento_mas_tardia))
        if direccion:
            clientes = clientes.filter(direccion=direccion)

        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
