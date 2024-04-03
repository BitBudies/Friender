from django.db import models

class Cliente(models.Model):
    GENERO_OPCIONES = (
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    )
    ESTADO_OPCIONES = (
        ('A', 'Activo'),
        ('I', 'Inactivo')
    )
    cliente_id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=20)
    ap_paterno = models.CharField(max_length=20)
    ap_materno = models.CharField(max_length=20)
    ci = models.IntegerField()
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=1, choices=GENERO_OPCIONES)
    direccion = models.CharField(max_length=100)
    descripcion = models.TextField(max_length=255)
    usuario = models.CharField(max_length=20)
    correo = models.CharField(max_length=100)
    contrasena = models.CharField(max_length=255)
    dinero = models.BigIntegerField()
    estado = models.CharField(max_length=1, choices=ESTADO_OPCIONES)
    timestamp_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.cliente_id} {self.nombre} {self.ap_paterno} {self.ap_materno}"