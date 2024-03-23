from django.db import models

class Fotografia(models.Model):
    
    
    ESTADO_FOTOGRAFIA = (
        ('R', 'Revisando'),
        ('P', 'Pendiente'),
        ('F', 'Finalizado')
    )
  
    fotografia_id = models.BigAutoField(primary_key=True)
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    url = models.CharField(max_length=20)
    estado_fotografia = models.CharField(max_length=1, choices=ESTADO_FOTOGRAFIA)
    
    
    def __str__(self):
        return f"{self.fotografia_id} de {self.cliente.nombre} en estado {self.estado_fotografia}"