from .amigo_views import AmigoDetailById,AmigoListLimitPaginator
from .cliente_views import ClienteDetailById, ClienteListLimitPaginator
from .login_views import LoginView
from .solicitud_views import AcceptSolicitud, RechazarSolicitud, GetSolicitudesCliente, EnviarSolicitud, SolicitudAlquilerDetailAPIView, VerificarSolicitudes
from .utils import correo_valido
from .filtros import ClientePorGenero