import base64
from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.response import Response
from rest_framework import status
from rest_framework import status
from amigo.models.clienteDB import Cliente
from amigo.models.fotografiaDB import Fotografia
from ..models import Amigo, Calificacion
from django.shortcuts import get_object_or_404
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def AmigoDetailById(request, amigo_id):
    print(amigo_id)
    print("holaaaa")
    amigo = get_object_or_404(Amigo, pk=amigo_id)
    calificaciones_amigo = Calificacion.objects.filter(amigo=amigo, emisor="cliente")
    if not calificaciones_amigo.exists():
        promedio_calificaciones = 0
    else:
        promedio_calificaciones = calificaciones_amigo.aggregate(Avg("puntuacion"))[
            "puntuacion__avg"
        ]

    fotografiaAmigo = Fotografia.objects.filter(cliente=amigo.cliente).order_by('prioridad')
    
    #imagenBase64 = None
    #if fotografiaAmigo:
    #    imagenBase64 = base64.b64encode(fotografiaAmigo.imagenBase64).decode("utf-8")
    imagenes = []
    for fotografia in fotografiaAmigo:
        imagenBase64 = None
        if fotografia.imagenBase64:
            imagenBase64 = base64.b64encode(fotografia.imagenBase64).decode("utf-8")
        imagenes.append({
            "imagenBase64": imagenBase64,
            "prioridad": fotografia.prioridad
        })

    data = {
        "amigo_id": amigo.amigo_id,
        "precio_amigo": amigo.precio,
        "nombre_completo": amigo.cliente.getFullName(),
        #"nombre": amigo.cliente.nombre.title(),
        #"ap_paterno": amigo.cliente.ap_paterno.title(),
        #"ap_materno": amigo.cliente.ap_materno.title() if amigo.cliente.ap_materno else amigo.cliente.ap_materno,
        "ci": amigo.cliente.ci,
        "fecha_nacimiento": amigo.cliente.fecha_nacimiento,
        "edad": amigo.cliente.calcular_edad(),
        "genero": amigo.cliente.genero,
        "direccion": amigo.cliente.direccion,
        "descripcion": amigo.cliente.descripcion,
        "usuario": amigo.cliente.user.username,
        "correo": amigo.cliente.correo,
        "dinero_amigo": amigo.dinero,
        "estado_amigo": amigo.estado,
        "registro_amigo": amigo.timestamp_registro,
        "numero_calificaciones": calificaciones_amigo.count(),
        "calificacion": promedio_calificaciones,
        #"imagenBase64": imagenBase64,
        "imagenes": imagenes,
    }
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def AmigoListLimitPaginator(request, page_number=1, limite=10):
    if limite <= 0:
        return Response(
            {"error": "El límite debe ser mayor que 0"}, status=status.HTTP_200_OK
        )
    elif limite > 50:
        return Response(
            {"error": "El límite no puede ser mayor que 50"},
            status=status.HTTP_200_OK,
        )
    elif page_number <= 0:
        return Response(
            {"error": "La pagina tiene que ser mayor a 0"},
            status=status.HTTP_200_OK,
        )

    amigos = Amigo.objects.order_by("amigo_id")  # ordenamiento temporal
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
            imagenBase64 = base64.b64encode(fotografiaAmigo.imagenBase64).decode(
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
            "calificacion": promedio_calificaciones,
            "cliente_id": amigo.cliente.cliente_id,
            "imagenBase64": imagenBase64,
        }
        data["amigos"].append(amigo_data)

    return Response(data)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def RegistrarAmigo(request):
    user = request.user
    print(request.POST)
    cliente = get_object_or_404(Cliente, user=user)
    precio = request.POST.get("precio")
    if precio == None:
        return Response({"error": "El precio es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
    if Amigo.objects.filter(cliente=cliente).exists():
        return Response({"error": "El cliente ya es un amigo"}, status=status.HTTP_400_BAD_REQUEST)
    amiwito = Amigo(
        cliente = cliente,
        precio = precio,
        estado = "A",
        dinero = 0
    )
    try:
        amiwito.save()
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"data":"uwu"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ClienteEsAmigo(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    
    amigo = Amigo.objects.filter(cliente=cliente).first()

    respuesta = {
        "amigo": False
    }
    if amigo:
        respuesta["precio"] = amigo.precio
        respuesta["amigo"] = True
    return Response({"data": respuesta}, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def PrecioAmiwo(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    data = {"precio": 0}
    try:
        amigo = Amigo.objects.get(cliente=cliente)
        data["precio"] = amigo.precio
    except Amigo.DoesNotExist:
        return Response(data, status=status.HTTP_200_OK)
    return Response(data, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def DeshabilitarAmigo(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    try:
        #Borrar amigo
        Amigo.objects.filter(cliente=cliente).delete();
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"data": True}, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def CambiarPrecioAmigo(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    precio = request.POST.get("precio")
    if not precio:
        return Response({"error": "El precio es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        #Borrar amigo
        Amigo.objects.filter(cliente=cliente).update(precio=precio);
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"data": "Precio cambiado correctamente"}, status=status.HTTP_200_OK)