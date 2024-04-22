from rest_framework import serializers
from ..models.gusto import Gusto

class GustoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gusto
        fields = '__all__'