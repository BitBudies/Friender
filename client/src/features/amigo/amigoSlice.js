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
    })
  }),
});

export const {useGetAmigosQuery,useGetAmigoByIdQuery} =
  amigoApi;