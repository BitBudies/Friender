from django.contrib import admin
from .models.clienteDB import Cliente
from .models.amigoDB import Amigo

# Register your models here.
admin.site.register(Cliente)
admin.site.register(Amigo)