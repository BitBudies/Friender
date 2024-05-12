import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAmigos: builder.mutation({
      query: ({ pagina, limite, token,filtros }) => ({
        url: `/filtros/filtrosPaginacion/pagina/${pagina}/limite/${limite}`,
        body: filtros,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        }
      }),
    }),
    getAmigoById: builder.query({
      query: ({id_amigo, token}) => ({
        url: `/amigo/${id_amigo}`,
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    getAmigoByfiltros: builder.query({
      query: ({filtros, token}) => ({
        url: `/filtros/filtrosPaginacion/pagina/${filtros}`,
        method: "POST",
        body: filtros,
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetAmigosMutation, useGetAmigoByIdQuery,useGetAmigoByfiltrosQuery } = amigoApi;
