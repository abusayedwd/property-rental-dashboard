

import { apiSlice } from "../../api/apiSlice";


const blockUnblockUser = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        blockUnblockUser: builder.mutation({
        query: (id) => ({
          url: `/users/blockstatus/${id}`,
          method: "PATCH", 
        }),
        invalidatesTags: (result, error, id) => [{ type: "Users" }, { type: "Users", id }],
      }),
    }),
  });
  
  export const { useBlockUnblockUserMutation } = blockUnblockUser;