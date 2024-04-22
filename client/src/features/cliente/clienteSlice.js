import { apiSlice } from "../api/apiSlice";

const clienteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClienteById: builder.query({
      query: (id_cliente) => "/cliente/" + id_cliente,
    }),
    getClienteInfo: builder.query({
      query: (token) => ({
        url: "/cliente/informacion",
        headers: {
          Authorization: `Token ${token}`, // Ejemplo de cómo agregar un token de autorización
        },
      }),
    }),
  }),
});

export const { useGetClienteByIdQuery, useGetClienteInfoQuery} = clienteApi;
