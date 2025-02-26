


import { apiSlice } from "../../api/apiSlice";


const updateTerms = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateTerms: builder.mutation({
        query: (value) => ({
          url: `/information/updateTermsCondition`,
          method: "PATCH",
          body: value,  
     
          headers: undefined,
        }),
        invalidatesTags: [{ type: "About" }],
      }),
    }),
  });
  
  export const { useUpdateTermsMutation } = updateTerms;