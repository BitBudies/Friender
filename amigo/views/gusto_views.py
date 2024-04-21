from rest_framework.decorators import api_view
from rest_framework.response import Response
from amigo.models.gusto import Gusto
from amigo.serializers.gusto_serializer import GustoSerializer

@api_view(["GET"])
def obtenerGustos(request):
    intereses = Gusto.objects.all().order_by('nombre')
    serializer = GustoSerializer(intereses, many=True)
    return Response(serializer.data, status=200)