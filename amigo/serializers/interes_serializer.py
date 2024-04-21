from rest_framework import serializers
from ..models.interes import Interes

class InteresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interes
        fields = '__all__'