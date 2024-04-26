from django.db import models


class Gusto(models.Model):
    ESTADO_OPCIONES = (("A", "Activo"), ("I", "Inactivo"))
    gusto_id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=15)
    descripcion = models.TextField(max_length=255)
    estado = models.CharField(max_length=1, choices=ESTADO_OPCIONES)
    timestamp_gusto = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.gusto_id} - {self.nombre} - {self.estado}"
