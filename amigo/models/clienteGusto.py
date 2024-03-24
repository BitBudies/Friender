from django.db import models
from .clienteDB import Cliente
from .gusto import Gusto

class ClienteGusto(models.Model):
    clienteGusto_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    gusto = models.ForeignKey(Gusto, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.clienteGusto_id}"