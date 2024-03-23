import { apiSlice } from "../api/apiSlice";

const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessage : builder.query({
        query : () => "/endpoint",
        providesTags : ["Test"]
      })
  }),
});

export const {useGetMessageQuery} =
testApi;