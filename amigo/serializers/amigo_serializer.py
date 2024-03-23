from rest_framework import serializers
from ..models import Amigo

class AmigoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amigo
        fields = '__all__'