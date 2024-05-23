import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAmigos: builder.mutation({
      query: ({ token, filtros }) => ({
        url: `/filtros/filtrosPaginacion`,
        body: filtros,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    getAmigoById: builder.query({
      query: ({ id_amigo, token }) => ({
        url: `/amigo/${id_amigo}`,
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetAmigosMutation, useGetAmigoByIdQuery } = amigoApi;
