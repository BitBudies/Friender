import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://friender-6lbr.onrender.com/api",
  }),
  tagTypes: ["Amigo","Auth","Cliente","Test","Solicitud"],
  endpoints: (builder) => ({}),
});