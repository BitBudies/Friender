from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from ..models import Amigo, Cliente
from ..serializers import ClienteSerializer

class PrecioPostTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('filtro_precio')  # Reemplaza 'nombre_de_tu_url' con el nombre de la URL de tu vista
        self.cliente1 = Cliente.objects.create( nombre='Juan',
                                                ap_paterno='Perez',
                                                ci=12345678,
                                                fecha_nacimiento='1990-01-01',
                                                genero='M',
                                                direccion='Calle 123',
                                                descripcion='Descripción de Juan',
                                                user='userupaplumpa',
                                                correo='juan@example.com',
                                                dinero=100.00,
                                                estado='A')
        
        self.cliente2 = Cliente.objects.create( nombre='Ana',
                                                ap_paterno='Gomez',
                                                ci=87654321,
                                                fecha_nacimiento='1992-02-02',
                                                genero='F',
                                                direccion='Avenida 456',
                                                descripcion='Descripción de Ana',
                                                user='umapalumpa2',
                                                correo='ana@example.com',
                                                dinero=200.00,
                                                estado='A')
        self.amigo1 = Amigo.objects.create(cliente=self.cliente1, precio=50)
        self.amigo2 = Amigo.objects.create(cliente=self.cliente2, precio=100)

    def test_post_precio(self):
        data = {
            "precio_min": "30",
            "precio_max": "60"
        }
        response = self.client.post(self.url, data, format='json')
        amigos = Amigo.objects.filter(precio__range=(data['precio_min'], data['precio_max']))
        clientes = [amigo.cliente for amigo in amigos]
        serializer = ClienteSerializer(clientes, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)