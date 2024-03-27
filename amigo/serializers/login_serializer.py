from rest_framework import serializers
from ..models.clienteDB import Cliente

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ('usuario', 'contrasena')