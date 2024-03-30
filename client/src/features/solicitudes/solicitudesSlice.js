import { apiSlice } from "../api/apiSlice";

const solicitudApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    enviarSolicitud : builder.mutation({
        query : (data) => ({
          url: "solicitud/",
          method : "POST",
          body: data,
        })
      })
  }),
});

export const { useEnviarSolicitudMutation} =
  solicitudApi;