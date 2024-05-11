import { apiSlice } from "../features/api/apiSlice";

const navBarApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEsAmigo: builder.query({
        query: (token) => ({
          url: `/clienteesamigo`,
          headers: {
            Authorization: `Token ${token}`
          },

        }),
    }),
    getClienteById: builder.query({
        query: ({ id_cliente, token }) => ({
          url: `/cliente/${id_cliente}`,
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
    }),
    getAmiwoPrecio: builder.query({
        query: (token) => ({
          url: `/amigo/precio`,
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
    }),
  }),
});

export const { useGetEsAmigoQuery, useGetClienteByIdQuery, useGetAmiwoPrecioQuery } = navBarApi;