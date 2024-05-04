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

# Variables globales para el control de intentos fallidos y bloqueo
login_failed_attempts = {}
block_time = {}

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
            try:
                user = User.objects.get(email=username_or_email)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            if not User.objects.filter(username=username_or_email).exists() and not User.objects.filter(email=username_or_email).exists():
                return Response({"error": "Datos incorrectos"}, status=status.HTTP_400_BAD_REQUEST)
            else:
               return self.incrementoFallo(username_or_email)

        if self.usuarioBloqueado(username_or_email):
            remaining_time = self.usuarioBloqueado(username_or_email)
            return Response({
                "error": f"Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos. Por favor, inténtalo de nuevo en {remaining_time} segundos.",
                "tiempo": remaining_time}, 
                status=status.HTTP_400_BAD_REQUEST)

        login_failed_attempts.pop(username_or_email, None)  # Limpiar intentos fallidos si el inicio de sesión es exitoso

        token, created = Token.objects.get_or_create(user=user)

        if created:
            token.delete()
            token = Token.objects.create(user=user)
        return Response(
            {
                "token": token.key,
                "message": "Inicio de sesión exitoso"
            },
            status=status.HTTP_201_CREATED,
        )
    
    def incrementoFallo(self, username_or_email):
        global login_failed_attempts, block_time
        
        if username_or_email not in login_failed_attempts:
            login_failed_attempts[username_or_email] = 1
        else:
            login_failed_attempts[username_or_email] += 1
            errores = login_failed_attempts[username_or_email]

            if errores == 3:
                block_time[username_or_email] = timezone.now() + timedelta(seconds=60)
                return Response({
                    "error": "Has excedido el límite de intentos. Por favor, inténtalo de nuevo en 60 segundos.",
                    "tiempo": 60}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif errores > 3:
                if block_time.get(username_or_email) and timezone.now() < block_time[username_or_email]:
                    remaining_time = int((block_time[username_or_email] - timezone.now()).total_seconds())
                    return Response({
                        "error": f"Inténtalo de nuevo en {remaining_time} segundos.",
                        "tiempo": remaining_time}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    login_failed_attempts[username_or_email] = 1
                    return Response({"error": "Datos incorrectos"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Datos incorrectos"}, status=status.HTTP_400_BAD_REQUEST)
    
    def usuarioBloqueado(self, username_or_email):
        global block_time
        
        if block_time.get(username_or_email) and timezone.now() < block_time[username_or_email]:
            remaining_time = int((block_time[username_or_email] - timezone.now()).total_seconds())
            return remaining_time
        return False
        