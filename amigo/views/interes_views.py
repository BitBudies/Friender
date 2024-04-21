from rest_framework.decorators import api_view
from rest_framework.response import Response
from amigo.models.interes import Interes
from amigo.serializers.interes_serializer import InteresSerializer

@api_view(["GET"])
def obtenerIntereses(request):
    intereses = Interes.objects.all().order_by('nombre')
    serializer = InteresSerializer(intereses, many=True)
    return Response(serializer.data, status=200)