from django.test import TestCase
from .utils import correo_valido, generate_key

class TestUtils(TestCase):
    def test_correo_valido(self):
        self.assertTrue(correo_valido("ricardorijas@gmail.com"))
        self.assertTrue(correo_valido("simonabastomart@gmail.com"))
        self.assertTrue(correo_valido("12456545@est.umss.edu"))
        self.assertTrue(correo_valido("juanto.de.dehua@gmail.com"))
        self.assertTrue(correo_valido("pepejuaa@hotmail.com"))
    pass
        
        