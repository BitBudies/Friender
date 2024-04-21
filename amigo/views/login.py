from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from amigo.serializers.cliente_serializer import UserTokenSerializer
from ..serializers.login_serializer import LoginSerializer
from ..models import Cliente
import time
# Para instalar
# pip install --upgrade djangorestframework-simplejwt

class Login(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get('username_or_email')
        password = request.data.get('password')
        
        if username_or_email and password:
            user = authenticate(username=username_or_email, password=password)
            if user is None:
                # Si la autenticación con el nombre de usuario falla, intentar autenticar utilizando el correo electrónico
                try:
                    user = User.objects.get(email=username_or_email)
                    user = authenticate(username=user.username, password=password)
                except User.DoesNotExist:
                    pass
            
            # Verificar si la autenticación fue exitosa
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                cliente = Cliente.objects.get(usuario=user)
                if created:
                    return Response({
                        'token': token.key,
                        'message': 'Inicio de sesión exitoso',
                        'cliente_id': cliente.cliente_id
                    }, status=status.HTTP_201_CREATED)
                else:
                    token.delete()
                    token = Token.objects.create(user=user)
                    return Response({
                        'token': token.key,
                        'message': 'Inicio de sesión exitoso',
                        'cliente_id': cliente.cliente_id
                    }, status=status.HTTP_201_CREATED)
            else:
                self.incrementoFallo(request)
                return self.verificarIntento(request)
        else:
            return Response({"error": "Faltan campos requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    