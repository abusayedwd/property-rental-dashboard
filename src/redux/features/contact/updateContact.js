

import { apiSlice } from "../../api/apiSlice";


const updateContact = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateContact: builder.mutation({
        query: (value) => ({
          url: `/contact/update`,
          method: "PUT",
          body: value,  
     
          headers: undefined,
        }),
        invalidatesTags: [{ type: "Contact" }],
      }),
    }),
  });
  
  export const { useUpdateContactMutation } = updateContact;