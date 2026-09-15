

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
    //   console.log("9 baseApi", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Promotion", "Product", "Users", "Coupon", "About","Property","Banner"],  

  endpoints: () => ({}),
});
