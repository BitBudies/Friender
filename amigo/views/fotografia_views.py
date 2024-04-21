import base64
import os
from django.db.models import Avg
from django.core.paginator import Paginator
from django.http import JsonResponse

from django.db.models import Q
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q
from django.contrib.auth.models import User

from amigo.models.clienteInteres import ClienteInteres
from amigo.models.interes import Interes
from amigo.serializers.cliente_serializer import ClienteSerializer
from amigo.serializers.interes_serializer import InteresSerializer

from ..models.clienteDB import Cliente
from ..models.fotografiaDB import Fotografia


class FotografiaPorID(APIView):
    def get(self, request, fotografia_id):
        try:
            fotografia = Fotografia.objects.get(pk=fotografia_id)
        except Fotografia.DoesNotExist:
            return Response(
                {"error": "Fotografia no encontrada"}, status=status.HTTP_404_NOT_FOUND
            )
        imagenBase64 = base64.b64encode(fotografia.imagenBase64).decode("utf-8")
        data = {
            "fotografia_id": fotografia.fotografia_id,
            "cliente_id": fotografia.cliente.cliente_id,
            "tipoImagen": fotografia.tipoImagen,
            "prioridad": fotografia.prioridad,
            "estado_fotografia": fotografia.estado_fotografia,
            "timestamp": fotografia.timestamp,
            "imagenBase64": imagenBase64,
        }
        return Response(data)


class FotografiasDeCliente(APIView):
    def get(self, request, cliente_id):
        try:
            cliente = Cliente.objects.get(pk=cliente_id)
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )

        fotografias = Fotografia.objects.filter(cliente=cliente)
        respuesta = []
        for foto in fotografias:
            imagenBase64 = base64.b64encode(foto.imagenBase64).decode("utf-8")
            newData = {
                "fotografia_id": foto.fotografia_id,
                "cliente_id": foto.cliente.cliente_id,
                "tipoImagen": foto.tipoImagen,
                "prioridad": foto.prioridad,
                "estado_fotografia": foto.estado_fotografia,
                "timestamp": foto.timestamp,
                "imagenBase64": imagenBase64,
            }
            respuesta.append(newData)
        return Response(respuesta)


class SubirFotografia(APIView):
    def post(self, request, format=None):
        for field in [
            "cliente_id",
            "tipoImagen",
            "prioridad",
            "imagen",
        ]:
            if field not in request.data:
                return Response(
                    {"error": f"{field} no encontrado en los datos"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        print(request.data)
        try:
            cliente = Cliente.objects.get(pk=request.data["cliente_id"])
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        imageBytes = request.data["imagen"].read()

        fotografiaNew = Fotografia(
            cliente=cliente,
            tipoImagen=request.data["tipoImagen"],
            prioridad=request.data["prioridad"],
            imagenBase64=imageBytes,
            estado_fotografia="P",
        )
        fotografiaNew.save()
        return Response(
            {"message": f"Imagen {fotografiaNew.fotografia_id} guardada exitosamente"},
            status=status.HTTP_201_CREATED,
        )


@csrf_exempt
def SubirFotografiaDef(request):
    print(request.POST)
    for field in ["cliente_id", "prioridad"]:
        if field not in request.POST:
            return JsonResponse(
                {"error": f"{field} no encontrado en los datos"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    if not "imagen" in request.FILES:
        return JsonResponse(
            {"error": f"{field} no encontrado en los datos"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        cliente = Cliente.objects.get(pk=request.POST["cliente_id"])
    except Cliente.DoesNotExist:
        return JsonResponse(
            {"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
    imagen = request.FILES["imagen"]
    imageBytes = imagen.read()
    tipo_archivo_mime = imagen.content_type
    tipoooo = None
    if tipo_archivo_mime == "image/jpeg":
        tipoooo = "jpeg"
    elif tipo_archivo_mime == "image/png":
        tipoooo = "png"
    else:
        return JsonResponse(
            {"error": "El archivo no es una imagen"}, status=status.HTTP_400_BAD_REQUEST
        )
    fotografiaNew = Fotografia(
        cliente=cliente,
        tipoImagen=tipoooo,
        prioridad=request.POST["prioridad"],
        imagenBase64=imageBytes,
        estado_fotografia="P",
    )
    fotografiaNew.save()
    print(
        f"Se guardo correctamente la imagen {tipoooo}, id: {fotografiaNew.fotografia_id}"
    )
    return JsonResponse(
        {
            "message": f"Se guardo correctamente la imagen {tipoooo}, id: {fotografiaNew.fotografia_id}"
        },
        status=status.HTTP_201_CREATED,
    )

@api_view(["POST"])
def pruebaApis(request):
    print(request.POST)
    print(request.FILES)
    #clienteSerializer = ClienteSerializer(data=request.POST)
    intereses = request.POST.getlist("intereses", [])
    if not intereses:
        return Response({"error": f"Los intereses son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)
    
    intereses_existentes = Interes.objects.filter(nombre__in=intereses)
    if intereses_existentes.count() != len(intereses):
        return Response({"error": "No se encontro los intereses en la base de datos"}, status=status.HTTP_404_NOT_FOUND)
    #-----------------------------------imagenes--------------------------------------

    imagenes = request.FILES.getlist("imagenes", [])
    if not imagenes:
        return Response({"error": f"Las imagenes son obligatorias"}, status=status.HTTP_400_BAD_REQUEST)
    
    # ------------------------------------cliente---------------------------------------
    
    clienteSerializado = ClienteSerializer(data=request.POST)
    if not clienteSerializado.is_valid():
        print(clienteSerializado.errors)
        return Response({"error": clienteSerializado.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    cliente = Cliente(**clienteSerializado.validated_data)
    if User.objects.filter(Q(username=cliente.usuario) | Q(email=cliente.correo)).exists():
        return Response(
            {"error": "El nombre de usuario o el correo ya están en uso."},
            status=400
        )
    
    #print(usuario.password)
    #print(make_password(cliente.contrasena)) son lo mismo
    
    usuario = User(username=cliente.usuario, email=cliente.correo)
    usuario.set_password(cliente.contrasena)
    cliente.usuario = usuario

    

    fotografiasTemporales = []
    for prioridad, imagen in enumerate(imagenes):
        if imagen.content_type not in ["image/jpeg", "image/png"]:
            return Response(
                {"error": "Solo se permiten imágenes JPEG o PNG."},
                status=400
            )
        foto = Fotografia(
            cliente = cliente,
            tipoImagen="jpeg" if imagen.content_type == "image/jpeg" else "png,",
            prioridad=prioridad,
            imagenBase64=imagen.read(),
            estado_fotografia="P"
        )
        fotografiasTemporales.append(foto)
    
    interesClienteTemporales = []
    for interes in intereses_existentes:
        interesCliente = ClienteInteres(
            cliente=cliente,
            interes=interes
        )
        interesClienteTemporales.append(interesCliente)
    usuario.save()
    cliente.save()
    for fotito in fotografiasTemporales:
        fotito.save()
    for interesClienteC in interesClienteTemporales:
        interesClienteC.save()
    
    
    return Response({"message": f"Se creo el usuario"}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(["POST"])
def crearClienteConFotografias(request):

    # --------------------------------------------verificar archivos----------------------------------------------
    imagenesSize = len(request.FILES)
    if imagenesSize < 1 or imagenesSize > 7:
        return JsonResponse(
            {"error": f"Se debe de subir de 1 a 7 imagenes"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    for _, fileContent in request.FILES.items():
        fileTipe = fileContent.content_type
        if fileTipe != "image/jpeg" and fileTipe != "image/png":
            return JsonResponse(
                {"error": f"Solo se admiten imagenes jpeg, jpg y png"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    # --------------------------------------------verificar archivos----------------------------------------------

    for field in [
        "nombre",
        "apellidoPaterno",
        "apellidoMaterno",
        "fechaNacimiento",
        "genero",
        "ubicacion",
        "usuario",
        "correo",
        "contrasena",
        "descripcion",
        "intereses",
    ]:
        if field not in request.POST or not request.POST[field]:
            return JsonResponse(
                {"error": f"El parametro: {field} es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # TODO verificar intereses al menos 1?

    # TODO crear cliente
    nombre = request.data.get("nombre")
    ap_paterno = request.data.get("ap_paterno")
    ap_materno = request.data.get("ap_materno")
    ci = request.data.get("ci")
    fecha_nacimiento = request.data.get("fecha_nacimiento")
    genero = request.data.get("genero")
    direccion = request.data.get("direccion")
    descripcion = request.data.get("descripcion")
    usuario = request.data.get("username")
    correo = request.data.get("correo")
    contrasena = request.data.get("password")

    if not all(
        [
            nombre,
            ap_paterno,
            ci,
            fecha_nacimiento,
            genero,
            direccion,
            descripcion,
            usuario,
            correo,
            contrasena,
        ]
    ):
        return Response(
            {"error": "Todos los campos son requeridos"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(Q(username=usuario) | Q(correo=correo)).exists():
        return Response(
            {"error": "El nombre de usuario o el correo ya están en uso."}, status=400
        )

    user = User.objects.create_user(username=usuario, email=correo, password=contrasena)

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
        estado="A",
    )

    for prioridad, fileContent in request.FILES.items():
        foto = Fotografia(
            # cliente = cliente #crear las imagenes para el cliente
            cliente_id=cliente.cliente_id,  # TODO temporal jeje
            tipoImagen="jpeg" if fileContent.content_type == "image/jpeg" else "png,",
            prioridad=prioridad,
            imagenBase64=fileContent.read(),
            estado_fotografia="P",
        )
        foto.save()
        print(foto)

    return JsonResponse(
        {"message": f"Se creo el cliente!"}, status=status.HTTP_201_CREATED
    )
