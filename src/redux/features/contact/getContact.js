
import { apiSlice } from "../../api/apiSlice";

const getContact = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContact: builder.query({
            query: (name) => `/contact`,
            providesTags: [{type: "Contact"}]
        })
    })
})

export const {useGetContactQuery} = getContact;