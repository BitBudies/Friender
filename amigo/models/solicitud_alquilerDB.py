from django.db import models
from amigo.models.amigoDB import Amigo
from amigo.models.clienteDB import Cliente


class solicitud_alquiler(models.Model):
    ESTADO_SOLICITUD = (
        ("E", "Enviado"),
        ("A", "Aceptado"),
        ("R", "Rechazado"),
        ("F", "Finalizado"),
    )
    solicitud_alquiler_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    amigo = models.ForeignKey(Amigo, on_delete=models.CASCADE)
    lugar = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=500)
    fecha_inicio = models.DateField()
    hora_inicio = models.TimeField()
    minutos = models.IntegerField()
    precio = models.IntegerField()
    estado_solicitud = models.CharField(max_length=1, choices=ESTADO_SOLICITUD)
    timestamp_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cliente: {self.cliente.nombre} Solicita servicio de: {self.amigo.cliente.nombre}"
