from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Cliente
from ..serializers.login_serializer import LoginSerializer



class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                user = Cliente.objects.get(usuario=serializer.data['usuario'])
                if user.contrasena == serializer.data['contrasena']:
                    return Response({"id": user.cliente_id}, status=status.HTTP_200_OK)
                else:
                    return Response({"id": "0"}, status=status.HTTP_404_NOT_FOUND)
            except Cliente.DoesNotExist:
                return Response({"id": "0"}, status=status.HTTP_404_NOT_FOUND)
        else:
            if not serializer.data['usuario'] and not serializer.data['contrasena']:
                return Response({"error":"Campo usuario y contraseña requeridos"}, status=status.HTTP_200_OK)
            if not serializer.data['usuario']: 
                return Response({"error":"Campo usuario requerido"}, status=status.HTTP_200_OK)
            else:
                return Response({"error":"Campo contraseña requerido"}, status=status.HTTP_200_OK)