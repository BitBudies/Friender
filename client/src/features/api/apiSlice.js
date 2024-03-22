import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/server",
  }),
  tagTypes: ["Amigo","Auth","Cliente"],
  endpoints: (builder) => ({}),
});