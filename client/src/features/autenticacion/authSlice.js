import { apiSlice } from "../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login : builder.mutation({
      query : (data) => ({
        url : "/cliente/login",
        method : "POST",
        body : data,
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
      })
    }),
    sendCode : builder.mutation({
      query : (data) => ({
        url : "/enviarCodigoRestablecimiento",
        method : "POST",
        body : data,
      })
    }),
    verifyCode : builder.mutation({
      query : (data) => ({
        url : "/verificarCodigosRestablecimiento",
        method : "POST",
        body : data,
      })
    }),
    changePass : builder.mutation({
      query : (data) => ({
        url : "/cambiarContrasena",
        method : "POST",
        body : data,
      })
    }),
  }),
});

const fotografiaAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage : builder.mutation({
      query : (data) => ({
        url: `/test/subirimagen`,
        method : "POST",
        body: data,
      })
    }),
    getImage : builder.query({
      query : (fotografia_id) => `/fotografia/${fotografia_id}`,
    })
  }),
});

// export const {useUploadImageMutation,useGetImageQuery} = fotografiaAPI;

export const {useLoginMutation,
      useFindEmailMutation,
      useSendCodeMutation,
      useVerifyCodeMutation, 
      useChangePassMutation,
      useGetInteresesQuery,
      useUploadImageMutation,
      useGetImageQuery,
    } = authApi;