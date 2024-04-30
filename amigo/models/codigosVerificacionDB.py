from django.db import models


class Codigos(models.Model):

    clave_id = models.BigAutoField(primary_key=True)
    correo = models.CharField(max_length=100)
    codigoVerificaion = models.CharField(max_length=64, null=True, blank=True)
    timestamp_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.clave_id} {self.correo} {self.timestamp_registro}"
