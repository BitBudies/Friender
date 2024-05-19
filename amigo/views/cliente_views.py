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

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ClienteDetailById(request, cliente_id):
    cliente = get_object_or_404(Cliente, pk=cliente_id)
    calificaciones_cliente = Calificacion.objects.filter(cliente=cliente, emisor="amigo")
    promedio_calificaciones = 0
    if calificaciones_cliente.exists():
        promedio_calificaciones = calificaciones_cliente.aggregate(Avg("puntuacion"))[
            "puntuacion__avg"
        ]
    fotografiaAmigo = Fotografia.objects.filter(cliente=cliente).order_by('prioridad')
    
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
    
    intereses = ClienteInteres.objects.filter(cliente=cliente)
    interes = []
    for i in intereses:
        interes.append(i.interes.nombre)

    data = {
        "cliente_id": cliente.cliente_id,
        "nombre_completo": cliente.getFullName(),
        #"nombre": cliente.nombre.title(),
        #"ap_paterno": cliente.ap_paterno.title(),
        #"ap_materno": cliente.ap_materno.title(),
        "ci": cliente.ci,
        "fecha_nacimiento": cliente.fecha_nacimiento,
        "edad": cliente.calcular_edad(),
        "genero": cliente.genero,
        "direccion": cliente.direccion,
        "descripcion": cliente.descripcion,
        "usuario": cliente.user.username,
        "correo": cliente.correo,
        "dinero": cliente.dinero,
        "estado": cliente.estado,
        "timestamp_registro": cliente.estado,
        "numero_calificaciones": calificaciones_cliente.count(),
        "calificacion": promedio_calificaciones,
        "imagenes": imagenes,
        "interes": interes
    }
    return Response(data)


class ClienteListLimitPaginator(APIView):
    def get(self, request, page_number=1, limite=10):
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
                {"error": "La página tiene que ser mayor a 0"},
                status=status.HTTP_200_OK,
            )

        clientes = Cliente.objects.order_by("cliente_id").values(
            "cliente_id", "nombre", "ap_paterno", "ap_materno", "fecha_nacimiento", "genero", "descripcion", "dinero", "estado"
        )
        paginator = Paginator(clientes, limite)

        try:
            page_obj = paginator.page(page_number)
        except Exception:
            return Response(
                {"error": "Página no encontrada"}, status=status.HTTP_404_NOT_FOUND
            )

        data = {
            "numero_paginas": paginator.num_pages,
            "numero_clientes_total": clientes.count(),
            "clientes": list(page_obj),
        }
        return Response(data)



# @csrf_exempt
# @api_view(["POST"])
class VerificarCorreoUsuario(APIView):
    def post(self, request):
        # print(request.POST)
        usuario = request.data.get("usuario")
        correo = request.data.get("correo")

        if not all([usuario, correo]):
            return Response(
                {"error": "Todos los campos son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not correo_valido(correo):
            return Response({
                "error": "Verifica que respete el formato: ejemplo@dominio.com",
                "email": "Verifica que respete el formato"
            }, status=400)

        if User.objects.filter(username=usuario).exists():
            return Response({
                "error": "Usuario ya existe",
                "username": "Usuario ya existe"
            }, status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=correo).exists():
            return Response({
                "error": "Correo ya existe",
                "email": "Correo registrado"
            }, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Usuario y correo válidos"}, status=status.HTTP_200_OK
        )
        


# Envia codigos de verificacion para el correo electronico
class EnviarCodigos(APIView):
    def post(self, request):
        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        ap_paterno = request.data.get("ap_paterno")

        if not all([correo, nombre, ap_paterno]):
            return Response(
                {"error": "Todos los campos son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not correo_valido(correo):
            return Response({"error": "El correo no es válido."}, status=400)

        codigoExistente = Codigos.objects.filter(correo=correo).first()

        if codigoExistente:
            #tiempo trasnscurrido desde que se envio el codigo
            tiempo = timezone.now() - codigoExistente.timestamp_registro
            if tiempo.total_seconds() < 60:
                tiempoRestante =  60 - int(tiempo.total_seconds())
                return Response(
                    {
                        "error": f"Debe esperar {tiempoRestante} segundos para enviar otro código de verificación",
                        "tiempo": tiempoRestante
                        },
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )
            else:
                codigoExistente.delete()
        codigo = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
        asunto = f"Tu código: {codigo}"
        mensaje = f"Hola: {nombre} {ap_paterno}, \nTu código de verificación de Friender es: {codigo} . \n\n Usalo para acceder a tu cuenta. \n Si no solicitaste esto, simplemente ignora este mensaje. \n\n Saludos, \n El equipo de Friender"

        codigos = Codigos.objects.create(correo=correo, codigoVerificaion=codigo)

        try:
            send_mail(
                asunto,
                mensaje,
                config("EMAIL_HOST_USER"),
                [correo],
                fail_silently=False,
            )
            return Response(
                {"message": "Correo enviado correctamente",
                 "tiempo": 60}, status=status.HTTP_200_OK
                 
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Verifica si el codigo de verificacion es correcto
class VerificarCodigo(APIView):
    def post(self, request):
        correo = request.data.get("correo")
        codigo = request.data.get("codigo")

        if not all([correo, codigo]):
            return Response(
                {"error": "Todos los campos son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not correo_valido(correo):
            return Response({"error": "El correo no es válido."}, status=400)

        try:
            codigos = Codigos.objects.get(correo=correo, codigoVerificaion=codigo)
            codigos.delete()
        except Codigos.DoesNotExist:
            return Response(
                {"error": "El código de verificación es incorrecto"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"message": "Correo verificado correctamente"}, status=status.HTTP_200_OK
        )


# Yon aqui lo de registra cliente
@api_view(["POST"])
def RegistrarCliente(request):
    print(request.POST)
    print(request.FILES)

    # clienteSerializer = ClienteSerializer(data=request.POST)
    intereses = request.POST.getlist("intereses", [])
    if not intereses:
        return Response(
            {"error": f"Los intereses son obligatorios"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    intereses_existentes = Interes.objects.filter(nombre__in=intereses)
    if intereses_existentes.count() != len(intereses):
        return Response(
            {"error": "No se encontro los intereses en la base de datos"},
            status=status.HTTP_404_NOT_FOUND,
        )
    # -----------------------------------imagenes--------------------------------------
    print(intereses, "intereses")

    imagenes = request.FILES.getlist("imagenes", [])
    if not imagenes:
        return Response(
            {"error": f"Las imagenes son obligatorias"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------cliente---------------------------------------
    jeje = request.POST.copy()
    print(jeje)
    if jeje["genero"] == "masculino":
        jeje["genero"] = "M"
    elif jeje["genero"] == "femenino":
        jeje["genero"] = "F"
    elif jeje["genero"] == "otro":
        jeje["genero"] = "O"

    clienteSerializado = ClienteSerializer(data=jeje)
    if not clienteSerializado.is_valid():
        print(clienteSerializado.errors)
        return Response(
            {"error": clienteSerializado.errors}, status=status.HTTP_400_BAD_REQUEST
        )

    cliente = Cliente(**clienteSerializado.validated_data)
    if User.objects.filter(
        Q(username=jeje["usuario"]) | Q(email=cliente.correo)
    ).exists():
        return Response(
            {"error": "El nombre de usuario o el correo ya están en uso."}, status=400
        )

    usuario = User(username=jeje["usuario"], email=cliente.correo)
    usuario.set_password(jeje["contrasena"])
    cliente.user = usuario

    fotografiasTemporales = []
    for prioridad, imagen in enumerate(imagenes):
        if imagen.content_type not in ["image/jpeg", "image/png"]:
            return Response(
                {"error": "Solo se permiten imágenes JPEG o PNG."}, status=400
            )
        foto = Fotografia(
            cliente=cliente,
            tipoImagen="jpeg" if imagen.content_type == "image/jpeg" else "png,",
            prioridad=prioridad,
            imagenBase64=imagen.read(),
            estado_fotografia="P",
        )
        fotografiasTemporales.append(foto)

    interesClienteTemporales = []
    for interes in intereses_existentes:
        interesCliente = ClienteInteres(cliente=cliente, interes=interes)
        interesClienteTemporales.append(interesCliente)
    usuario.save()
    cliente.save()
    for fotito in fotografiasTemporales:
        fotito.save()
    for interesClienteC in interesClienteTemporales:
        interesClienteC.save()

    return Response(
        {"message": f"Cliente registrado correctamente"}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtenerInformacionCliente(request):
    user = request.user
    cliente = get_object_or_404(Cliente, user=user)
    fotografiaAmigo = Fotografia.objects.filter(cliente=cliente, prioridad=0).first()
    imagenBase64 = None
    if fotografiaAmigo:
        imagenBase64 = base64.b64encode(fotografiaAmigo.imagenBase64).decode("utf-8")

    serializer = ClienteSerializer(cliente)
    data = serializer.data
    data["nombre_completo"] = cliente.getFullName()
    data["imagenBase64"] = imagenBase64
    return Response(data, status=status.HTTP_200_OK)
