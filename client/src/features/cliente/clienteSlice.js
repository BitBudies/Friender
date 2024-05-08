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
      query: ({ precio, token }) => ({
        url: `/registraramigo`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body : {precio}
      }),
    }),
    deshabilitarAmigo: builder.mutation({
      query: ({ token }) => ({
        url: `/deshabilitaramigo`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetClienteByIdQuery, useGetClienteInfoQuery } = clienteApi;
