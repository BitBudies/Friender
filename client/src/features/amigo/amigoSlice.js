import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    getAmigos : builder.query({
      query : ({pagina, limite}) => `/amigos/pagina/${pagina}/limite/${limite}`,
      providesTags : ["Amigo"]
    }),
    getAmigoById : builder.query({
      query : (id_amigo) => `/amigo/${id_amigo}`,
      providesTags : ["Amigo"]
    }),
    solicitarContacto : builder.mutation({
      query : (data) => ({
        url: "/solicitud",
        method : "POST",
        body: data,
      })
    })
  }),
});

export const {useGetAmigosQuery,useGetAmigoByIdQuery,useSolicitarContactoMutation} =
  amigoApi;