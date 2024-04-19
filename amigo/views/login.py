from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from amigo.serializers.cliente_serializer import UserTokenSerializer
from ..serializers.login_serializer import LoginSerializer
# Para instalar
# pip install --upgrade djangorestframework-simplejwt
class Login(ObtainAuthToken):
    def post(self,request,*args,**kwargs):
         username = request.data.get('username')
         password = request.data.get('password')
         login_serializer = self.serializer_class(data = request.data, context = {'request':request})

         if not all([username, password]):
            return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
         
         userObject = authenticate(username=username, password=password)
         if userObject is not None:
            # El usuario existe y la contraseña es correcta
             #login_serializer = self.serializer_class(data = request.data, context = {'request':request})
             if login_serializer.is_valid():
                userData = login_serializer.validated_data['user']
                print(userData)
                token,created = Token.objects.get_or_create(user = userData)
                user_serializer = UserTokenSerializer(userData)
                print(userData)
                if created:
                    print('created')
                    return Response({
                        'token': token.key,
                        'message': 'Inicio de sesion exitoso'
                    }, status= status.HTTP_201_CREATED)
         else:
            return Response({"error": "Nombre de usuario o contraseña incorrectos"}, status=status.HTTP_400_BAD_REQUEST)

    