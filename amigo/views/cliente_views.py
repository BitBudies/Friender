from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.utils.encoding import force_str

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from rest_framework.response import Response
from rest_framework import status


import random
import string

from amigo.serializers.cliente_serializer import ClienteSerializer




from ..models import Cliente 
from ..models import Codigos   


from .utils import calcular_edad


from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator

from decouple import config


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




class ClienteRegistrar(APIView):
    def post(self, request):
        # Obtén todos los campos de request.data
        nombre = request.data.get('nombre')
        ap_paterno = request.data.get('ap_paterno')
        ap_materno = request.data.get('ap_materno')
        ci = request.data.get('ci')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        genero = request.data.get('genero')
        direccion = request.data.get('direccion')
        descripcion = request.data.get('descripcion')
        usuario = request.data.get('username')
        correo = request.data.get('correo')
        contrasena = request.data.get('password')
       


        # Verifica que todos los campos requeridos estén presentes
        if not all([nombre, ap_paterno, ci, fecha_nacimiento, genero, direccion, descripcion, usuario, correo, contrasena]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=usuario).exists():
            return Response({'error': 'Un usuario con ese nombre ya existe.'}, status=400)
        
        user = User.objects.create_user(username=usuario, email=correo, password=contrasena)
        
        
        codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        asunto = 'Verificación de correo'
        mensaje = f'Hola, {nombre} {ap_paterno} {ap_materno}, tu código de verificación es: {codigo}'
    
        # Crea el cliente
        cliente = Cliente.objects.create(
            nombre=nombre,
            ap_paterno=ap_paterno,
            ap_materno=ap_materno,
            ci=ci,
            fecha_nacimiento=fecha_nacimiento,
            genero=genero,
            direccion=direccion,
            descripcion=descripcion,
            usuario=user,
            correo=correo,
            contrasena=make_password(contrasena),
            codigoVerificaion=codigo,
        )
        
        
        try:
            send_mail(
                asunto,
                mensaje,
                config('EMAIL_HOST_USER'),
                [correo],
                fail_silently=False,
            )
            return Response({"message": "Correo enviado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     
     
             
class ClienteVerificar(APIView):
    def post(self, request):
        usuario = request.data.get('usuario')
        codigo = request.data.get('codigo')
        
        if not all([usuario, codigo]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cliente = Cliente.objects.get(usuario=usuario, codigoVerificaion=codigo)
        except Cliente.DoesNotExist:
            return Response({"error": "Usuario o código de verificación son incorrectos"}, status=status.HTTP_404_NOT_FOUND)
        
        cliente.codigoVerificaion = None
        cliente.estado = 'A'
        
        cliente.save()
        
        
        
        return Response({"message": "Correo verificado correctamente"}, status=status.HTTP_200_OK) 
    
    
    
    
    
    #Nuevo -------------------------
    
    
#Verifica si el usuario y correo ya existen  Funciona
class VerificarCorreoUsuario(APIView):
    def post(self, request):
        usuario = request.data.get('usuario')
        correo = request.data.get('correo')
        
        if not all([usuario, correo]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        if Cliente.objects.filter(usuario=usuario).exists():
            return Response({"error": "Usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        if Cliente.objects.filter(correo=correo).exists():
            return Response({"error": "Correo ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "Usuario y correo validos"}, status=status.HTTP_200_OK)

   
#Envia codigos de verificacion para el correo electronico  Funciona
class EnviarCodigos(APIView):
    def post(self, request):
        correo = request.data.get('correo')
        nombre = request.data.get('nombre')
        ap_paterno = request.data.get('ap_paterno')
        
        if not all([correo, nombre, ap_paterno]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        asunto = 'Verificación de correo para Friender'
        mensaje = f'Hola, {nombre} {ap_paterno}, tu código de verificación de Friender es: {codigo}'
        
        codigos = Codigos.objects.create(
            correo=correo,
            codigoVerificaion=codigo
        )
        
        try:
            send_mail(
                asunto,
                mensaje,
                config('EMAIL_HOST_USER'),
                [correo],
                fail_silently=False,
            )
            return Response({"message": "Correo enviado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
#Verifica si el codigo de verificacion es correcto
class VerificarCodigo(APIView):
    def post(self, request):
        correo = request.data.get('correo')
        codigo = request.data.get('codigo')
        
        if not all([correo, codigo]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            codigos = Codigos.objects.get(correo=correo, codigoVerificaion=codigo)
            codigos.delete()
        except Codigos.DoesNotExist:
            return Response({"error": "El codigo de verificaion son incorrectos"}, status=status.HTTP_404_NOT_FOUND)


            
        return Response({"message": "Correo verificado correctamente"}, status=status.HTTP_200_OK)
    
    #Yon aqui lo de registra cliente 
class RegistraCliente(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        ap_paterno = request.data.get('ap_paterno')
        ap_materno = request.data.get('ap_materno')
        ci = request.data.get('ci')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        genero = request.data.get('genero')
        direccion = request.data.get('direccion')
        descripcion = request.data.get('descripcion')
        usuario = request.data.get('username')
        correo = request.data.get('correo')
        contrasena = request.data.get('password')
       


        # Verifica que todos los campos requeridos estén presentes
        if not all([nombre, ap_paterno, ci, fecha_nacimiento, genero, direccion, descripcion, usuario, correo, contrasena]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=usuario).exists():
            return Response({'error': 'Un usuario con ese nombre ya existe.'}, status=400)
        
        user = User.objects.create_user(username=usuario, email=correo, password=contrasena)
      
        # Crea el cliente
        cliente = Cliente.objects.create(
            nombre=nombre,
            ap_paterno=ap_paterno,
            ap_materno=ap_materno,
            ci=ci,
            fecha_nacimiento=fecha_nacimiento,
            genero=genero,
            direccion=direccion,
            descripcion=descripcion,
            usuario=user,
            correo=correo,
            contrasena=make_password(contrasena),
            estado='A',
        )
        
        return Response({"message": "Cliente registrado correctamente"}, status=status.HTTP_200_OK)
          
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtenerInformacionCliente(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    serializer = ClienteSerializer(cliente)
    data = serializer.data
    data["nombre_completo"] = cliente.getFullName()
    return Response(data, status=status.HTTP_200_OK)