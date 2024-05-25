from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from ..models import Cliente, Amigo, Calificacion, Fotografia
from datetime import date
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from django.db.models import Avg
from django.core.paginator import Paginator
import base64


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def AmigoListLimitPaginator(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    page_number = request.data.get("pagina")
    limite = request.data.get("limite")
    generos = request.data.get("generos")
    edadMin = request.data.get("edad_min")
    edadMax = request.data.get("edad_max")
    direccion = request.data.get("ubicacion")
    interes = request.data.get("interes")
    precioMin = request.data.get("precio_min")
    precioMax = request.data.get("precio_max")

    amigos = Amigo.objects.exclude(cliente=cliente).order_by(
        "amigo_id"
    )
    if generos:
        amigos = amigos.filter(cliente__genero__in=generos)
    if edadMin and edadMax:
        fecha_nacimiento_mas_tardia = date.today().replace(
            year=date.today().year - int(edadMin)
        )
        fecha_nacimiento_mas_temprana = date.today().replace(
            year=date.today().year - int(edadMax)
        )
        amigos = amigos.filter(
            cliente__fecha_nacimiento__range=(
                fecha_nacimiento_mas_temprana,
                fecha_nacimiento_mas_tardia,
            )
        )
    if direccion:
        amigos = amigos.filter(cliente__direccion=direccion)
    if interes:
        for interes in interes:
            amigos = amigos.filter(cliente__clienteinteres__interes__nombre=interes)
    if precioMin is not None:
        amigos = amigos.filter(precio__gte=precioMin)

    if precioMax is not None:
        amigos = amigos.filter(precio__lte=precioMax)

    paginator = Paginator(amigos, limite)

    try:
        page_obj = paginator.page(page_number)
    except Exception:
        return Response(
            {"error": "Página no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    amigos_data = []
    
    for amigo in page_obj:
        calificaciones_amigo = Calificacion.objects.filter(
            amigo=amigo, emisor="cliente"
        ).values('amigo').annotate(promedio=Avg('puntuacion'))

        fotografia_amigo = Fotografia.objects.filter(
            cliente=amigo.cliente, prioridad=0
        ).first()

        imagen_base64 = None
        if fotografia_amigo:
            imagen_base64 = base64.b64encode(fotografia_amigo.imagenBase64).decode(
                "utf-8"
            )

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
            "calificacion": calificaciones_amigo[0]['promedio'] if calificaciones_amigo.exists() else 0,
            "cliente_id": amigo.cliente.cliente_id,
            "imagenBase64": imagen_base64,
        }
        amigos_data.append(amigo_data)

    data = {
        "numero_paginas": paginator.num_pages,
        "numero_amigos_total": amigos.count(),
        "amigos": amigos_data,
    }
    return Response(data)
