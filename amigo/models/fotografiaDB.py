from django.db import models
from amigo.models.clienteDB import Cliente


class Fotografia(models.Model):
    ESTADO_FOTOGRAFIA = (("R", "Revisando"), ("P", "Pendiente"), ("F", "Finalizado"))
    fotografia_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    tipoImagen = models.CharField(max_length=20)
    prioridad = models.IntegerField(default=0)
    imagenBase64 = models.BinaryField(null=True, blank=True)
    estado_fotografia = models.CharField(max_length=1, choices=ESTADO_FOTOGRAFIA)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fotografia_id} de {self.cliente.nombre} en estado {self.estado_fotografia}"
