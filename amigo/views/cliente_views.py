from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.utils.encoding import force_str
import random
import string

from ..models import Cliente 


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
        #dinero = request.data.get('dinero')
        estado = request.data.get('estado')

        # Verifica que todos los campos requeridos estén presentes
        if not all([nombre, ap_paterno, ap_materno, ci, fecha_nacimiento, genero, direccion, descripcion, usuario, correo, contrasena, estado]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=usuario).exists():
            return Response({'error': 'Un usuario con ese nombre ya existe.'}, status=400)
        
        
        codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        asunto = 'Verificación de correo'
        mensaje = f'Hola, {nombre} {ap_paterno} {ap_materno}, tu código de verificación es: {codigo}'
        
        
        # Crea el usuario
        user = User.objects.create_user(username=usuario, password=contrasena, email=correo)

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
            #dinero=dinero,
            estado=estado
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
        
        
        r#eturn Response({"message": "Usuario y cliente creados correctamente"}, status=status.HTTP_201_CREATED)
    




# class EnviarCorreo(APIView):
#     def post(self, request):
        
    
           
#         # Verifica que todos los campos requeridos estén presentes
#         if not all([asunto, mensaje, destinatario]):
#             return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

#         # Envia el correo
#         try:
#             send_mail(
#                 asunto,
#                 mensaje,
#                 config('EMAIL_HOST_USER'),
#                 [destinatario],
#                 fail_silently=False,
#             )
#             return Response({"message": "Correo enviado correctamente"}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        