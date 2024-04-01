import { apiSlice } from "../api/apiSlice";

const solicitudApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    enviarSolicitud : builder.mutation({
        query : (data) => ({
          url: "/solicitud",
          method : "POST",
          body: data,
        })
      }),
    getSolicitudes : builder.query({
      query : (id_cliente) => `/cliente/solicitudes/recibidas/${id_cliente}`
    }),
    getSolicitudPendienteById : builder.query({
      query : (id_solicitud) => `/solicitud/informacion/${id_solicitud}` 
    })
  }),
});

export const { useEnviarSolicitudMutation, useGetSolicitudesQuery,useGetSolicitudPendienteByIdQuery} =
  solicitudApi;