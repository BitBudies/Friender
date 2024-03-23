from django.db import models

class Cliente(models.Model):
  
    calificacion_id = models.BigAutoField(primary_key=True)
    puntuacion = models.IntegerField()
    comentario = models.CharField(max_length=100)
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    amigo = models.ForeignKey('Amigo', on_delete=models.CASCADE)
    emisor = models.CharField(max_length=20)
    
    timestamp_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Calificaion {self.puntuacion} para  {self.cliente.nombre}"