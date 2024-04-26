from django.db import models
from .gusto import Gusto
from .clienteDB import Cliente


class ClienteGusto(models.Model):
    clienteGusto_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    gusto = models.ForeignKey(Gusto, on_delete=models.CASCADE)

    def __str__(self):
        return f"A {self.cliente.getFullName} le gusta {self.gusto.nombre}"
