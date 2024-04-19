import { apiSlice } from "../api/apiSlice";

const clienteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClienteById : builder.query({
      query : (id_cliente) => "/cliente/" + id_cliente 
    })
  }),
});

export const {useGetClienteByIdQuery} =
  clienteApi;