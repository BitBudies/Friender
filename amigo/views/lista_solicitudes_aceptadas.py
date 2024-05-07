from django.http import JsonResponse
from ..models import solicitud_alquiler
from ..models import Calificacion
def  ObtenerListaDeSolicitudes(request, amigo_id):
    solicitudes_aceptadas = solicitud_alquiler.objects.filter(amigo_id=amigo_id, estado_solicitud='A')
    data = []
