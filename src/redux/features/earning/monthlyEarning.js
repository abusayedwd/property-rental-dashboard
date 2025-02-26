import { apiSlice } from "../../api/apiSlice"; 


const chatEarning = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        chatEarning : builder.query({
            query: (year) => `/payment/monthlyEarning?year=${year}`,
            providesTags: [{type: "Dashboard"}]
          
        })
    })
})

export const {useChatEarningQuery} = chatEarning;