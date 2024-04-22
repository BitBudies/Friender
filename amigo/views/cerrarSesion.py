from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class Logout(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response({"message": "Sesión cerrada exitosamente"}, status=status.HTTP_200_OK)