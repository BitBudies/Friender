from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from amigo.serializers.cliente_serializer import UserTokenSerializer
from ..serializers.login_serializer import LoginSerializer

class Login(ObtainAuthToken):
    def post(self,request,*args,**kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        login_serializer = self.serializer_class(data = request.data, context = {'request':request})