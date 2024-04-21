import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAmigos: builder.query({
      query: ({ pagina, limite, token }) => ({
        url: `/amigos/pagina/${pagina}/limite/${limite}`,
        headers: {
          Authorization: `Token ${token}`, // Ejemplo de cómo agregar un token de autorización
        },
      }),
    }),
    //"Authorization": `Token ${getCookie("token")}`
    getAmigoById: builder.query({
      query: ({id_amigo, token}) => ({
        url: `/amigo/${id_amigo}`,
        headers: {
          Authorization: `Token ${token}`, // Ejemplo de cómo agregar un token de autorización
        },
      }),
    }),
  }),
});

export const { useGetAmigosQuery, useGetAmigoByIdQuery } = amigoApi;
