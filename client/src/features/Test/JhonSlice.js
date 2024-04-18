import { apiSlice } from "../api/apiSlice";

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

export const {useUploadImageMutation,useGetImageQuery} = fotografiaAPI;