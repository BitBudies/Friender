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
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from amigo.views.amigo_views import AmigoDetailById,AmigoListLimitPaginator
from amigo.views.cliente_views import ClienteDetailById, ClienteListLimitPaginator, ClienteRegistrar
from amigo.views.edicion_views import findEmail
from amigo.views.fotografia_views import FotografiaPorID, FotografiasDeCliente, SubirFotografia, SubirFotografiaDef
from amigo.views.login_views import LoginView
from amigo.views.solicitud_views import AcceptSolicitud, RechazarSolicitud, GetSolicitudesCliente, EnviarSolicitud, GetSolicitudesRecibidas, SolicitudAlquilerDetailAPIView, VerificarSolicitudes
from amigo.views.utils import enviar_correo_prueba
from amigo.views.login import Login
#router = routers.DefaultRouter()
#router.register(r'solicitud', SolicitudViewSet)

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
    path('api/cliente/<int:cliente_id>/', ClienteDetailById.as_view()),
    path('api/cliente/solicitudes/<int:cliente_id>/', GetSolicitudesCliente.as_view()),
    path('api/clientes/pagina/<int:page_number>/limite/<int:limite>', ClienteListLimitPaginator.as_view()),
    path('api/amigo/solicitudes/recibidas/<int:amigo_id>/', GetSolicitudesRecibidas.as_view()),
    
    path('api/cliente/registrar/', ClienteRegistrar.as_view()),
    
    #path('api/cliente/<uidb64>/<token>/',views.activate , ClienteRegistrar.as_view()),
    path('api/cliente/login/', Login.as_view()),
    # probando postsssss
    path('api/solicitud', EnviarSolicitud.as_view()),
    
    # Amigo
    path('api/amigo/<int:amigo_id>/', AmigoDetailById.as_view()),
    path('api/amigos/pagina/<int:page_number>/limite/<int:limite>', AmigoListLimitPaginator.as_view()),

    # Solicitud
    path('api/solicitud/aceptar/<int:solicitud_alquiler_id>', AcceptSolicitud.as_view()),
    path('api/solicitud/rechazar/<int:solicitud_alquiler_id>', RechazarSolicitud.as_view()),
    path('api/solicitud/informacion/<int:solicitud_alquiler_id>', SolicitudAlquilerDetailAPIView.as_view()),
    path('api/solicitud/verificar/<int:cliente_idR>/<int:amigo_idR>/', VerificarSolicitudes.as_view()),
   
    
    #Fotografias
    path('api/fotografia/<int:fotografia_id>', FotografiaPorID.as_view()),
    path('api/cliente/fotografias/<int:cliente_id>', FotografiasDeCliente.as_view()),
    path('api/fotografia/subir', SubirFotografia.as_view()),
    path('api/test/subirimagen', SubirFotografiaDef),

    # Credenciales
    path('api/login', LoginView.as_view(), name = 'login'),
    path('api/test/correo', enviar_correo_prueba, name = 'correo'),
    
    path('api/findEmail', findEmail),

    #ducumentacion de la API
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), 
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    
  #  path('correo/', EnviarCorreo.as_view())
]