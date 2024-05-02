from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework import serializers
# Para instalar
# pip install --upgrade djangorestframework-simplejwt

class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=65)

class Login(ObtainAuthToken):
    serializer_class = LoginSerializer
    @method_decorator(never_cache)
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({"error": "Faltan campos obligatorios"}, 
                            status=status.HTTP_400_BAD_REQUEST
                            )

        username_or_email = serializer.validated_data.get("username_or_email")
        password = serializer.validated_data.get("password")

        if not (username_or_email and password):
            return Response(
                {"error": "Faltan campos obligatorios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username_or_email, password=password)
        if not user:
            # Si la autenticación con el nombre de usuario falla, intentar autenticar utilizando el correo electrónico
            try:
                user = User.objects.get(email=username_or_email)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                pass

        # Verificar si la autenticación fue exitosa
        if not user:
            if not User.objects.filter(username=username_or_email).exists() and not User.objects.filter(email=username_or_email).exists():
                #self.incrementoFallo(request)
                #self.verificarIntento(request)
                # esto es de Usuario o correo incorrecto, a solicitud de qa el mensaje cambio
                return Response({"error": f"{request.session['block_time']} y {type(request.session['login_failed_attempts'])}"}, status=status.HTTP_400_BAD_REQUEST)
            else:
               return self.incrementoFallo(request)

        if self.usuarioBloqueado(request):
            remaining_time = self.usuarioBloqueado(request)
            return Response({"error": f"{request.session['block_time']} y {type(request.session['login_failed_attempts'])}"}, status=status.HTTP_400_BAD_REQUEST)

        request.session['login_failed_attempts'] = 0 
        token, created = Token.objects.get_or_create(user=user)

        # cliente = Cliente.objects.get(user=user)
        if created:
            token.delete()
            token = Token.objects.create(user=user)
        return Response(
            {
                "token": token.key,
                "message": "Inicio de sesión exitoso"
                #'cliente_id': cliente.cliente_id
                # front solo debe de recibir el token
            },
            status=status.HTTP_201_CREATED,
        )
    
    def incrementoFallo(self, request):
        if 'login_failed_attempts' not in request.session:
            request.session['login_failed_attempts'] = 1
        else:
            request.session['login_failed_attempts'] += 1
            errores = request.session['login_failed_attempts']

            if errores == 3:
                request.session['block_time'] = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
                return Response({
                    "error": f"{request.session['block_time']} y {type(request.session['login_failed_attempts'])}",
                    "tiempo": 60}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif errores > 3:
                block_time_str = request.session.get('block_time')
                if block_time_str:
                    block_time = timezone.make_aware(datetime.strptime(block_time_str, '%Y-%m-%d %H:%M:%S'))
                    if timezone.now() > block_time + timedelta(seconds=60):
                        request.session['login_failed_attempts'] = 1
                        return Response({"error": f"{request.session['block_time']} y {type(request.session['login_failed_attempts'])}"}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        remaining_time = int((block_time + timedelta(seconds=60) - timezone.now()).total_seconds())
                        return Response({
                            "error": f"{request.session['block_time']} y {type(request.session['login_failed_attempts'])}",
                            "tiempo": remaining_time}, status=status.HTTP_400_BAD_REQUEST)
        # esto es de contraseña incorrecta, a solicitud de qa el mensaje cambio
        return Response({"error": f"{request.session['block_time']} y {type(request.session['login_failed_attempts'])}"}, status=status.HTTP_400_BAD_REQUEST)
    
    def usuarioBloqueado(self, request):
        block_time_str = request.session.get('block_time')
        if block_time_str:
            block_time = timezone.make_aware(datetime.strptime(block_time_str, '%Y-%m-%d %H:%M:%S'))
            remaining_time = int((block_time + timedelta(seconds=60) - timezone.now()).total_seconds())
            if remaining_time > 0:
                return remaining_time
        return False

    

    
        

        