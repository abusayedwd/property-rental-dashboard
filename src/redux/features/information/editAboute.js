import { apiSlice } from "../../api/apiSlice";


const updateAboute = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAboute: builder.mutation({
        query: (value) => ({
          url: `/information/updateAbout`,
          method: "PATCH",
          body: value,  
     
          headers: undefined,
        }),
        invalidatesTags: [{ type: "About" }],
      }),
    }),
  });
  
  export const { useUpdateAbouteMutation } = updateAboute;