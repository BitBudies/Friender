from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.core.cache import cache
import asyncio
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
# Para instalar
# pip install --upgrade djangorestframework-simplejwt


class Login(ObtainAuthToken):
    @method_decorator(never_cache)
    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get("username_or_email")
        password = request.data.get("password")

        if not (username_or_email and password):
            return Response(
                {"error": "Faltan campos requeridos"},
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
                return Response({"error": "Username o correo incorrecto"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                self.incrementoFallo(request)
                #self.verificarIntento(request)
                return Response({"error": "Contraseña incorrecta", "intentos_fallidos": request.session.get('login_failed_attempts', 0)}, status=status.HTTP_400_BAD_REQUEST)
            
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
            if errores == 3 or errores > 3:
                # Enviar mensaje y estado al front
                message = {"error": "Contraseña incorrecta", "intentos_fallidos": errores}
                response = Response(message, status=status.HTTP_400_BAD_REQUEST)
                # Llamar a la función bloquear
                asyncio.run(self.bloquear(request))
                return response

    async def bloquear(self, request):
        request.session['login_failed_attempts'] = 0  # Reiniciar los intentos fallidos
        response = {"error": "Has excedido el límite de intentos. Por favor, inténtalo de nuevo en 60 segundos.", "intentos_fallidos": 3}

        # Esperar 60 segundos antes de eliminar el bloqueo
        await asyncio.sleep(60)
        cache.delete('blocked_user_' + request.session.session_key)
        # Retornar la respuesta
        return Response(response, status=status.HTTP_429_TOO_MANY_REQUESTS)
        

        