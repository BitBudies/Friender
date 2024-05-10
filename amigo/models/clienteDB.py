from django.db import models
from django.contrib.auth.models import User
from datetime import date


class Cliente(models.Model):
    GENERO_OPCIONES = (
        ("M", "Masculino"),
        ("F", "Femenino"),
        ("O", "Otro"),
    )
    ESTADO_OPCIONES = (("A", "Activo"), ("I", "Inactivo"))
    cliente_id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=20)
    ap_paterno = models.CharField(max_length=20)
    ap_materno = models.CharField(max_length=20, null=True)
    ci = models.IntegerField()
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=1, choices=GENERO_OPCIONES)
    direccion = models.CharField(max_length=100)
    descripcion = models.TextField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    correo = models.CharField(max_length=100)
    codigoVerificaion = models.CharField(max_length=5, null=True, blank=True)

    dinero = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(max_length=1, choices=ESTADO_OPCIONES, default="I")
    timestamp_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente_id} {self.nombre} {self.ap_paterno} {self.ap_materno} edad {self.calcular_edad()} vive en {self.direccion}"

    def getFullName(self):
        full_name = f"{self.nombre.title()} {self.ap_paterno.title()}"
        if self.ap_materno:
            full_name += f" {self.ap_materno.title()}"
        return full_name

    def calcular_edad(self):
        today = date.today()
        age = (
            today.year
            - self.fecha_nacimiento.year
            - (
                (today.month, today.day)
                < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
            )
        )
        return age
