from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from django.contrib.auth.models import User

class TestVerificarCorreoUsuario(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('verificarCorreoUser')  # Reemplaza 'nombre_de_tu_url' con el nombre de la url de tu vista

    def test_campos_requeridos(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Todos los campos son requeridos"})

    def test_correo_invalido(self):
        response = self.client.post(self.url, {'usuario': 'testuser', 'correo': 'invalido'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Verifica que respete el formato: ejemplo@dominio.com", "email": "Verifica que respete el formato"})

    def test_usuario_ya_existe(self):
        User.objects.create(username='simon', email='chulumpi@example.com')
        response = self.client.post(self.url, {'usuario': 'simon', 'correo': 'test2@example.com'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Usuario ya existe", "username": "Usuario ya existe"})

    def test_correo_ya_existe(self):
        User.objects.create(username='testuser', email='simonabastomart@gmail.com')
        response = self.client.post(self.url, {'usuario': 'testuser2', 'correo': 'simonabastomart@gmail.com'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Correo ya existe", "email": "Correo registrado"})
    
    def test_usuario_y_correo_validos(self):
        response = self.client.post(self.url, {'usuario': 'uservalido123', 'correo': 'juantochoripan@hotcito.com'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Usuario y correo válidos"})