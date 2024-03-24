"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
<<<<<<< HEAD
from amigo.views import ClienteDetailById, AmigoListLimit, AmigoDetailById, ClienteListLimit
=======
from amigo.views import ClienteDetailById, ClienteListView, AmigoListAPIView
>>>>>>> 5575d703f7c7e3eef9402f5e8162a8a9467192f7

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/cliente/<int:cliente_id>/', ClienteDetailById.as_view(), name='cliente-detail-id'),
<<<<<<< HEAD
    path('api/listaClientes/<int:limite>/', ClienteListLimit.as_view(), name='clientes-lista-limite'),
    path('api/listaClientes/', ClienteListLimit.as_view(), name='clientes-lista-10'),

    path('api/listaAmigos/<int:limite>/', AmigoListLimit.as_view(), name='amigos-lista-limite'),
    path('api/listaAmigos/', AmigoListLimit.as_view(), name='amigos-lista-10'),
    
    path('api/amigo/<int:amigo_id>/', AmigoDetailById.as_view(), name = 'amigo-detail-id'),
=======
    path('api/listaClientes/<int:limite>/', ClienteListView.as_view(), name='cliente-list-limite'),
    path('api/amigo/<int:amigo_id>/', AmigoListAPIView.as_view(), name = 'amigo-detail-id')
>>>>>>> 5575d703f7c7e3eef9402f5e8162a8a9467192f7
]
