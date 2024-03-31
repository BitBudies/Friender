from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Cliente 


from .utils import calcular_edad

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

