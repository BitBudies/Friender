from django.db import models
from .clienteDB import Cliente
from .interes import Interes

class ClienteInteres(models.Model):
    clienteInteres_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    interes = models.ForeignKey(Interes, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.clienteInteres_id}"