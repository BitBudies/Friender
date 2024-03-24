import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    getAmigos : builder.query({
      query : () => "/listaAmigos",
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