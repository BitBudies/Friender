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
from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from amigo.views.amigo_views import AmigoDetailById, AmigoListLimitPaginator
from amigo.views.cliente_views import ClienteListLimitPaginator, ClienteDetailById
from amigo.views.solicitud_views import SolicitudViewSet, EnviarSolicitud,GetSolicitudesCliente,AcceptSolicitud, RechazarSolicitud
from amigo.views.login_views import LoginView

router = routers.DefaultRouter()
router.register(r'solicitud', SolicitudViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Documentacion de la API 🐸",
        default_version='v1',
        description="Documentacion de los Endpoints de la API de Friender",
        contact=openapi.Contact(email="contactKevin@friender.xyz"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    #permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Cliente
    path('api/cliente/<int:cliente_id>/', ClienteDetailById.as_view(), name='cliente-detail-id'),
    path('api/cliente/solicitudes/<int:cliente_id>/', GetSolicitudesCliente.as_view(), name='cliente-solicitud-detail-id'),
    path('api/clientes/pagina/<int:page_number>/limite/<int:limite>', ClienteListLimitPaginator.as_view(), name = 'lista-clientes-pagina-limite'),
    # probando postsssss
    path('api/cliente/enviar/solicitud', EnviarSolicitud.as_view(), name = 'cliente-enviar-solicitud'),

    # Amigo
    path('api/amigo/<int:amigo_id>/', AmigoDetailById.as_view(), name = 'amigo-detail-id'),
    path('api/amigos/pagina/<int:page_number>/limite/<int:limite>', AmigoListLimitPaginator.as_view(), name='lista-amigos-pagina-limite'),

    # Solicitud
    path('api/solicitud/aceptar/<int:solicitud_alquiler_id>', AcceptSolicitud.as_view(), name='aceptar-solicitud-alquiler'),
    path('api/solicitud/rechazar/<int:solicitud_alquiler_id>', RechazarSolicitud.as_view(), name='rechazar-solicitud-alquiler'),

    # Credenciales
    path('api/login/', LoginView.as_view(), name = 'login'),
    
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), #ducumentacion de la API
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/', include(router.urls))
]