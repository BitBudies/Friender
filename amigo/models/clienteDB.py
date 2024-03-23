from django.db import models

class Cliente(models.Model):
    GENERO_OPCIONES = (
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    )
    
    ESTADO_OPCIONES = (
        ('A', 'Activo'),
        ('I', 'Inactivo'),
    )
    
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=20)
    ap_paterno = models.CharField(max_length=20)
    ap_materno = models.CharField(max_length=20)
    ci = models.IntegerField()
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=1, choices=GENERO_OPCIONES)
    direccion = models.CharField(max_length=60)
    descripcion = models.TextField(max_length=100)
    estado = models.CharField(max_length=1, choices=ESTADO_OPCIONES)
    