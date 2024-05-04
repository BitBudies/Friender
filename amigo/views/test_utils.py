from django.test import TestCase
from .utils import correo_valido, generate_key,contrasena_valida

import unittest 


# class TestUtils(TestCase):
#     def test_correo_valido(self):
#         self.assertTrue(correo_valido("ricardorijas@gmail.com")) 
#     pass
# class TestUtils2(unittest.TestCase):
#     def test_correo_valido(self):
#         self.assertTrue(correo_valido("simonabastomart@gmail.com"))
#     pass
# class TestUtils2(unittest.TestCase):
#     def test_correo_valido(self):
#         self.assertTrue(correo_valido("12456545@est.umss.edu"))
#     pass

# class TestUtils3(unittest.TestCase):
#     def test_correo_valido(self):
#         self.assertTrue(correo_valido("juanto.de.dehua@gmail.com"))
#     pass

# class TestUtils4(unittest.TestCase):
#     def test_correo_valido(self):
#         self.assertTrue(correo_valido("pepejuaa@hotmail.com"))
#     pass

class TestUtils(TestCase):
    def test_correo_valido_1(self):
        self.assertTrue(correo_valido("ricardorijas@gmail.com"))

    def test_correo_valido_2(self):
        self.assertTrue(correo_valido("simonabastomart@gmail.com"))

    def test_correo_valido_3(self):
        self.assertTrue(correo_valido("12456545@est.umss.edu"))

    def test_correo_valido_4(self):
        self.assertTrue(correo_valido("juanto.de.dehua@gmail.com"))

    def test_correo_valido_5(self):
        self.assertTrue(correo_valido("pepejuaa@hotmail.com"))
        
class TestUtils(TestCase):
    def test_contrasena_valida(self):
        self.assertTrue(contrasena_valida("Abc123!@#"))

    def test_contrasena_invalida(self):
        self.assertFalse(contrasena_valida("password"))

    def test_contrasena_invalida2(self):
        self.assertFalse(contrasena_valida("1234567890"))

    def test_contrasena_invalida3(self):
        self.assertFalse(contrasena_valida("abcABC123"))

    def test_contrasena_invalida4(self):
        self.assertFalse(contrasena_valida("abcABC!@#"))

    def test_contrasena_invalida5(self):
        self.assertFalse(contrasena_valida("!@#$%^&*()"))

    def test_contrasena_invalida6(self):
        self.assertFalse(contrasena_valida(""))

    def test_contrasena_invalida7(self):
        self.assertFalse(contrasena_valida("a" * 100))