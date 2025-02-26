

import { apiSlice } from "../../api/apiSlice";


const blockUnblockUser = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        blockUnblockUser: builder.mutation({
        query: (id) => ({
          url: `/users/blockstatus/${id}`,
          method: "PATCH", 
        }),
        invalidatesTags: [{ type: "Users" }],
      }),
    }),
  });
  
  export const { useBlockUnblockUserMutation } = blockUnblockUser;