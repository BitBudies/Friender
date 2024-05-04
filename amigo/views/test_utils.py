from django.test import TestCase
from .utils import correo_valido, generate_key

import unittest 


class TestUtils(TestCase):
    def test_correo_valido(self):
        self.assertTrue(correo_valido("ricardorijas@gmail.com")) 
    pass
class TestUtils2(unittest.TestCase):
    def test_correo_valido(self):
        self.assertTrue(correo_valido("simonabastomart@gmail.com"))
    pass
class TestUtils2(unittest.TestCase):
    def test_correo_valido(self):
        self.assertTrue(correo_valido("12456545@est.umss.edu"))
    pass

class TestUtils3(unittest.TestCase):
    def test_correo_valido(self):
        self.assertTrue(correo_valido("juanto.de.dehua@gmail.com"))
    pass

class TestUtils4(unittest.TestCase):
    def test_correo_valido(self):
        self.assertTrue(correo_valido("pepejuaa@hotmail.com"))
    pass