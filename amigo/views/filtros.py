
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from amigo.serializers.cliente_serializer import ClienteSerializer
from ..models import Cliente , ClienteInteres, Amigo, Calificacion, Fotografia
from datetime import date
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
# filtrar por edad, precio, genero, ubicacion, intereses
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.db.models import Avg
from django.core.paginator import Paginator
import base64

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
    
class InteresToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        interes = request.data.get('interes')
        clientes_interes = ClienteInteres.objects.filter(interes__nombre__in=interes)
        clientes = [ci.cliente for ci in clientes_interes]
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)
    
class PrecioToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        precioMin = request.data.get('precio_min')
        precioMax = request.data.get('precio_max')
        precio_amigo = Amigo.objects.filter(precio__range=(precioMin, precioMax))
        clientes = [amigo.cliente for amigo in precio_amigo]
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

class FiltroTotalToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
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
    
    
class FiltroPaginacion(APIView):
    @api_view(["POST"])
    @authentication_classes([TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def AmigoListLimitPaginator(request, page_number=1, limite=10):
        genero = request.data.get('genero')  
        edadMin = request.data.get('edad_min')  
        edadMax = request.data.get('edad_max')  
        direccion = request.data.get('ubicacion')  
        interes = request.data.get('interes')
        precioMin = request.data.get('precio_min')
        precioMax = request.data.get('precio_max')

        amigos = Amigo.objects.order_by("amigo_id")  # ordenamiento temporal
        if genero:
            amigos = amigos.filter(cliente__genero=genero)
        if edadMin and edadMax:
            fecha_nacimiento_mas_tardia = date.today().replace(year=date.today().year - int(edadMin))
            fecha_nacimiento_mas_temprana = date.today().replace(year=date.today().year - int(edadMax))
            amigos = amigos.filter(cliente__fecha_nacimiento__range=(fecha_nacimiento_mas_temprana, fecha_nacimiento_mas_tardia))
        if direccion:
            amigos = amigos.filter(cliente__direccion=direccion)
        if interes:
            clientes_interes = ClienteInteres.objects.filter(interes__nombre__in=interes, cliente__in = [amigo.cliente for amigo in amigos])
            amigos = Amigo.objects.filter(cliente__in=[ci.cliente for ci in clientes_interes])
        if precioMin and precioMax:
            amigos = amigos.filter(precio__range=(precioMin, precioMax))

        paginator = Paginator(amigos, limite)

        try:
            page_obj = paginator.page(page_number)
        except Exception:
            return Response(
                {"error": "Página no encontrada"}, status=status.HTTP_404_NOT_FOUND
            )

        data = {
            "numero_paginas": paginator.num_pages,
            "numero_amigos_total": amigos.count(),
            "amigos": [],
        }
        for amigo in page_obj:
            calificaciones_amigo = Calificacion.objects.filter(
                amigo=amigo, emisor="cliente"
            )
            if not calificaciones_amigo.exists():
                promedio_calificaciones = 0
            else:
                # se calcula el promedio de las puntuaciones
                promedio_calificaciones = calificaciones_amigo.aggregate(Avg("puntuacion"))[
                    "puntuacion__avg"
                ]

            fotografiaAmigo = Fotografia.objects.filter(
                cliente=amigo.cliente, prioridad=0
            ).first()
            imagenBase64 = None
            if fotografiaAmigo:
                imagenBase64 = base64.b64encode(fotografiaAmigo.imagenBase64).decode("utf-8")

            amigo_data = {
                "amigo_id": amigo.amigo_id,
                "precio_amigo": amigo.precio,
                "nombre_completo": amigo.cliente.getFullName(),
                "nombre": amigo.cliente.nombre.title(),
                "ap_paterno": amigo.cliente.ap_paterno.title(),
                "ap_materno": amigo.cliente.ap_materno.title() if amigo.cliente.ap_materno else amigo.cliente.ap_materno,
                "fecha_nacimiento": amigo.cliente.fecha_nacimiento,
                "edad": amigo.cliente.calcular_edad(),
                "genero": amigo.cliente.genero,
                "direccion": amigo.cliente.direccion,
                "descripcion": amigo.cliente.descripcion,
                "estado_amigo": amigo.estado,
                "numero_califiaciiones": calificaciones_amigo.count(),
                "calificacion": promedio_calificaciones,
                "cliente_id": amigo.cliente.cliente_id,
                "imagenBase64": imagenBase64,
            }
            data["amigos"].append(amigo_data)

        return Response(data)
