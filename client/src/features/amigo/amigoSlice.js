import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    getAmigos : builder.query({
      query : () => "/listaAmigos",
      providesTags : ["Amigo"]
    })
  }),
});

export const {useGetAmigosQuery} =
  amigoApi;