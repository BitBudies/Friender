from rest_framework import serializers
from ..models.clienteDB import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        exclude = ['user']

class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'