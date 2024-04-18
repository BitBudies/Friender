import { apiSlice } from "../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login : builder.mutation({
      query : (data) => ({
        url : "/login",
        method : "POST",
        body : data,
      })
    })
  }),
});


export const {useLoginMutation} = authApi;

