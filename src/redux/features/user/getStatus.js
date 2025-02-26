import { apiSlice } from "../../api/apiSlice";

const getStatus = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStatus: builder.query({
            query: () => `/payment/totalStatus`
        }),
        
    })
})

export const {useGetStatusQuery} = getStatus;