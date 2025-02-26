

import { apiSlice } from "../../api/apiSlice";


const updatePrivacy = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updatePrivacy: builder.mutation({
        query: (value) => ({
          url: `/information/updatePrivacy`,
          method: "PATCH",
          body: value,  
     
          headers: undefined,
        }),
        invalidatesTags: [{ type: "About" }],
      }),
    }),
  });
  
  export const { useUpdatePrivacyMutation } = updatePrivacy;