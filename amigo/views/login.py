from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from amigo.serializers.cliente_serializer import UserTokenSerializer
from ..serializers.login_serializer import LoginSerializer
from ..models import Cliente
# Para instalar
# pip install --upgrade djangorestframework-simplejwt
class Login(ObtainAuthToken):
    def post(self,request,*args,**kwargs):
        
         username = request.data.get('username')
         password = request.data.get('password')
         print(username,password)
         login_serializer = self.serializer_class(data = request.data, context = {'request':request})

        #  if not all([username, password]):
        #     return Response({"error": "Todos los campos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
         
         cliente = Cliente.objects.filter(usuario=username).first()

         userObject = authenticate(username=cliente.usuario, password=cliente.contrasena)
         print(cliente.usuario)
         if userObject is not None:
            # El usuario existe y la contraseña es correcta
             #login_serializer = self.serializer_class(data = request.data, context = {'request':request})
             if login_serializer.is_valid():
                userData = login_serializer.validated_data['user']
                print(userData)
                token,created = Token.objects.get_or_create(user = userData)
                user_serializer = UserTokenSerializer(userData)
                print(userData)
                cliente = Cliente.objects.get(usuario=userData)
                if created:
                    print('created')
                    return Response({
                        'token': token.key,
                        'message': 'Inicio de sesion exitoso',
                        'cliente_id': cliente.cliente_id
                    }, status= status.HTTP_201_CREATED)
                else:
                    token.delete()
                    token = Token.objects.create(user = userData)
                    return Response({
                    'token': token.key,
                    'message': 'Inicio de sesion exitoso',
                    'cliente_id': cliente.cliente_id
                    }, status= status.HTTP_201_CREATED)
                # return Response({"message": "Inicio de sesión exitoso"}, status=status.HTTP_200_OK)
         else:
            return Response({"error": "Nombre de usuario o contraseña incorrectos"}, status=status.HTTP_404_NOT_FOUND)

    