import { apiSlice } from "../../api/apiSlice";

const getEarning = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEarning: builder.query({
            query: ( ) => `/payment/getPaymentHistory`
        })
    })
})

export const {useGetEarningQuery} = getEarning;