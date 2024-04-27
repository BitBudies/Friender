from django.db import models
from .interes import Interes
from .clienteDB import Cliente


class ClienteInteres(models.Model):
    clienteInteres_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    interes = models.ForeignKey(Interes, on_delete=models.CASCADE)

    def __str__(self):
        return f"A {self.cliente.getFullName} le interesa {self.interes.nombre}"
