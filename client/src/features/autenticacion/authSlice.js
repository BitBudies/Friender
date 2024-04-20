import { apiSlice } from "../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login : builder.mutation({
      query : (data) => ({
        url : "/login",
        method : "POST",
        body : data,
      })
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
    })
  }),
});

export const {useLoginMutation, useFindEmailMutation, useSendCodeMutation, useVerifyCodeMutation, useChangePassMutation} = authApi;