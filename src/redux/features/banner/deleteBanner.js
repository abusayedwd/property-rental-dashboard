import { apiSlice } from "../../api/apiSlice";

const deleteBanner = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/banner/${id}`,
                method: "DELETE", 
            }),
            invalidatesTags: [{type: "Banner"}]
        })
    })
})

  export const {useDeleteBannerMutation} = deleteBanner;