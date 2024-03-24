from django.contrib import admin
from .models.clienteDB import Cliente
from .models.amigoDB import Amigo
from .models.solicitud_alquilerDB import solicitud_alquiler
from .models.calificacionDB import Calificacion
from .models.fotografiaDB import Fotografia


# Register your models here.
admin.site.register(Cliente)
admin.site.register(Amigo)
admin.site.register(solicitud_alquiler)
admin.site.register(Calificacion)
admin.site.register(Fotografia)

# Register your models here.
admin.site.register(Cliente)
admin.site.register(Amigo)
