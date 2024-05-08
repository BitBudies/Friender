import { apiSlice } from "../api/apiSlice";

const clienteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClienteById: builder.query({
      query: ({ id_cliente, token }) => ({
        url: `/cliente/${id_cliente}`,
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    getClienteInfo: builder.query({
      query: (token) => ({
        url: "/cliente/informacion",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    habilitarAmigo: builder.mutation({
      query: ({ id_amigo, token }) => ({
        url: `/amigo/${id_amigo}`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetClienteByIdQuery, useGetClienteInfoQuery } = clienteApi;
