import { apiSlice } from "../../api/apiSlice";

const getBanner = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBanner: builder.query({
            query: (name) => `/banner`,
            providesTags: [{type: "Banner"}]
        })
    })
})

export const {useGetBannerQuery} = getBanner;