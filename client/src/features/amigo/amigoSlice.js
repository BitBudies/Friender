import { apiSlice } from "../api/apiSlice";

const amigoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAmigos: builder.query({
      query: ({ pagina, limite }) => ({
        url: `/amigos/pagina/${pagina}/limite/${limite}`,
        providesTags: ["Amigo"],
      }),
    }),
    //"Authorization": `Token ${getCookie("token")}`
    getAmigoById: builder.query({
      query: (id_amigo) => ({
        url: `/amigo/${id_amigo}`,
        headers: {
          Authorization: `Token ${getCookie("token")}`, // Ejemplo de cómo agregar un token de autorización
        },
      }),
    }),
  }),
});

function getCookie(name) {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? cookieValue.pop() : "";
}

export const { useGetAmigosQuery, useGetAmigoByIdQuery } = amigoApi;
