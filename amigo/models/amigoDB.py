from django.db import models
from .clienteDB import Cliente


class Amigo(models.Model):
    ESTADOS_AMIGO = (("A", "Activo"), ("O", "Ocupado"), ("I", "Inactivo"))
    amigo_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    precio = models.BigIntegerField()
    dinero = models.BigIntegerField()
    estado = models.CharField(max_length=1, choices=ESTADOS_AMIGO)
    timestamp_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amigo_id} {self.cliente} {self.precio}"
