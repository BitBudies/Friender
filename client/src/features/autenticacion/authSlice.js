import { apiSlice } from "../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/cliente/login",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    getIntereses: builder.query({
      query: () => "/intereses",
    }),
    findEmail: builder.mutation({
      query: (data) => ({
        url: "/findEmail",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    sendCode: builder.mutation({
      query: (data) => ({
        url: "/enviarCodigoRestablecimiento",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    verifyTokenCode: builder.query({
      query: (tokencito) => ({
        url: `/verificarTokenRestablecimiento/${tokencito}`,
      }),
    }),
    changePass: builder.mutation({
      query: (data) => ({
        url: "/cambiarContrasena",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    regist1: builder.mutation({
      query: (data) => ({
        url: "/cliente/verificarCorreoUser",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    sendCodeRegist: builder.mutation({
      query: (data) => ({
        url: "/cliente/enviarCodigos",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    verifyCodeRegist: builder.mutation({
      query: (data) => ({
        url: "/cliente/verificarCodigo",
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    getCsrf: builder.query({
      query: () => `/get/csrf`,
    }),
  }),
});

const fotografiaAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (data, csrf) => ({
        url: `/test/pruebaApi`,
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF desde las cookies
        },
      }),
    }),
    getImage: builder.query({
      query: (fotografia_id) => `/fotografia/${fotografia_id}`,
    }),
  }),
});

function getCookie(name) {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  // console.log(cookieValue)
  return cookieValue ? cookieValue.pop() : "";
}

// export const {useUploadImageMutation,useGetImageQuery} = fotografiaAPI;

export const {
  useLoginMutation,
  useFindEmailMutation,
  useSendCodeMutation,
  useVerifyTokenCodeQuery,
  useChangePassMutation,
  useGetInteresesQuery,
  useGetCsrfQuery,
  useUploadImageMutation,
  useRegist1Mutation,
  useGetImageQuery,
  useSendCodeRegistMutation,
  useVerifyCodeRegistMutation,
} = authApi;
