from django.contrib import admin

from amigo.models.clienteGusto import ClienteGusto
from amigo.models.clienteInteres import ClienteInteres
from amigo.models.gusto import Gusto
from amigo.models.interes import Interes
from .models.clienteDB import Cliente
from .models.amigoDB import Amigo
from .models.solicitud_alquilerDB import solicitud_alquiler
from .models.calificacionDB import Calificacion
from .models.fotografiaDB import Fotografia
from .models.codigosVerificacionDB import Codigos

# Register your models here.
admin.site.register(Cliente)
admin.site.register(Amigo)
admin.site.register(solicitud_alquiler)
admin.site.register(Calificacion)
admin.site.register(Fotografia)
admin.site.register(Interes)
admin.site.register(Gusto)
admin.site.register(Codigos)
admin.site.register(ClienteInteres)
admin.site.register(ClienteGusto)