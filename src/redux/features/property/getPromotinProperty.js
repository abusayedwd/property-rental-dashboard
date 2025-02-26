
import { apiSlice } from "../../api/apiSlice";

const getPromotedProperties = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPromotedProperties: builder.query({
            query: (name) => `/property/getPromotedProperties`,
            providesTags: [{type: "Property"}]
        })
    })
})

export const {useGetPromotedPropertiesQuery} = getPromotedProperties;