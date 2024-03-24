from rest_framework import serializers
from ..models.solicitud_alquilerDB import solicitud_alquiler

class SolicitudAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = solicitud_alquiler
        fields = '__all__'