
import { apiSlice } from "../../api/apiSlice";

const addBanner = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addBanner: builder.mutation({
            query: (data) => ({
                url: `/banner/addbanner`,
                method: "POST",
                body: data
            }),
            invalidatesTags: [{type: "Banner"}]
        })
    })
})

  export const {useAddBannerMutation} = addBanner;