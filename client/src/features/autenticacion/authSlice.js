import { apiSlice } from "../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login : builder.mutation({
      query : (data) => ({
        url : "/cliente/login",
        method : "POST",
        body : data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken") // Obtener el token CSRF desde las cookies
        },
      })
    }),
    getIntereses : builder.query({
      query : () => "/intereses"
    }),
    findEmail : builder.mutation({
      query : (data) => ({
        url : "/findEmail",
        method : "POST",
        body : data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken") // Obtener el token CSRF desde las cookies
        },
      })
    }),
    sendCode : builder.mutation({
      query : (data) => ({
        url : "/enviarCodigoRestablecimiento",
        method : "POST",
        body : data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken") // Obtener el token CSRF desde las cookies
        },
      })
    }),
    verifyCode : builder.mutation({
      query : (data) => ({
        url : "/verificarCodigosRestablecimiento",
        method : "POST",
        body : data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken") // Obtener el token CSRF desde las cookies
        },
      })
    }),
    changePass : builder.mutation({
      query : (data) => ({
        url : "/cambiarContrasena",
        method : "POST",
        body : data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken") // Obtener el token CSRF desde las cookies
        },
      })
    }),
    getCsrf : builder.query({
      query : () => `/get/csrf` 
    }),
  }),
});

const fotografiaAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage : builder.mutation({
      query : (data, csrf) => ({
        url: `/test/pruebaApi`,
        method : "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken") // Obtener el token CSRF desde las cookies
        },
      })
    }),
    getImage : builder.query({
      query : (fotografia_id) => `/fotografia/${fotografia_id}`,
    })
  }),
});

function getCookie(name) {
  const cookieValue = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return cookieValue ? cookieValue.pop() : "";
}

// export const {useUploadImageMutation,useGetImageQuery} = fotografiaAPI;

export const {useLoginMutation,
      useFindEmailMutation,
      useSendCodeMutation,
      useVerifyCodeMutation, 
      useChangePassMutation,
      useGetInteresesQuery,
      useGetCsrfQuery,
      useUploadImageMutation,
      useGetImageQuery,
    } = authApi;