import { apiSlice } from "../api/apiSlice";

const solicitudApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    enviarSolicitud: builder.mutation({
      query: (data) => ({
        url: "/solicitud",
        method: "POST",
        body: data,
      }),
    }),
    getSolicitudes: builder.query({
      query: (token) => ({
        url: "/amigo/solicitudes/recibidas",
        headers: {
          Authorization: `Token ${token}`
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
      }),
    }),
    rechazarSolicitud: builder.mutation({
      query: (id_solicitud) => ({
        url: `/solicitud/rechazar/${id_solicitud}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useEnviarSolicitudMutation,
  useGetSolicitudesQuery,
  useGetSolicitudPendienteByIdQuery,
  useAceptarSolicitudMutation,
  useRechazarSolicitudMutation,
} = solicitudApi;
