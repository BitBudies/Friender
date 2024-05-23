import { apiSlice } from "../api/apiSlice";

const solicitudApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    enviarSolicitud: builder.mutation({
      query: ({ data, token }) => ({
        url: "/solicitud",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
          Authorization: `Token ${token}`,
        },
      }),
    }),
    getSolicitudes: builder.query({
      query: (token) => ({
        url: "/amigo/solicitudes/recibidas",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    getSolicitudPendienteById: builder.query({
      query: (id_solicitud) => `/solicitud/informacion/${id_solicitud}`,
    }),
    aceptarSolicitud: builder.mutation({
      query: (id_solicitud) => ({
        url: `/solicitud/aceptar/${id_solicitud}`,
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    getSolicitudesAceptadas: builder.query({
      query: (token) => ({
        url: "/amigo/solicitudes-aceptadas",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    rechazarSolicitud: builder.mutation({
      query: (id_solicitud) => ({
        url: `/solicitud/rechazar/${id_solicitud}`,
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
  }),
});

function getCookie(name) {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? cookieValue.pop() : "";
}

export const {
  useEnviarSolicitudMutation,
  useGetSolicitudesQuery,
  useGetSolicitudPendienteByIdQuery,
  useAceptarSolicitudMutation,
  useRechazarSolicitudMutation,
  useGetSolicitudesAceptadasQuery,
} = solicitudApi;
