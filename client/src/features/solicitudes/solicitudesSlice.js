import { apiSlice } from "../api/apiSlice";

const solicitudApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    enviarSolicitud : builder.mutation({
        query : (data) => ({
          url: "/solicitud",
          method : "POST",
          body: data,
        }),
        invalidatesTags : ['Solicitud']
      }),
    getSolicitudes : builder.query({
      query : (id_cliente) => `/amigo/solicitudes/recibidas/${id_cliente}`,
      providesTags: ['Solicitud'],
    }),
    getSolicitudPendienteById : builder.query({
      query : (id_solicitud) => `/solicitud/informacion/${id_solicitud}` 
    }),
    aceptarSolicitud : builder.mutation({
      query : (id_solicitud) => ({
        url: `/solicitud/aceptar/${id_solicitud}`,
        method: "POST"
      }),
      invalidatesTags : ['Solicitud'],
    }),
    rechazarSolicitud : builder.mutation({
      query : (id_solicitud) => ({
        url: `/solicitud/rechazar/${id_solicitud}`,
        method : "POST"
      }),
      invalidatesTags : ['Solicitud'],
    })
  }),
});

export const { useEnviarSolicitudMutation, 
               useGetSolicitudesQuery,
               useGetSolicitudPendienteByIdQuery,
               useAceptarSolicitudMutation,
              useRechazarSolicitudMutation} =
  solicitudApi;