
import { apiSlice } from "../../api/apiSlice";

const deleteproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        deleteproperty: builder.mutation({
            query: (id) => ({
                url: `/property/${id}`,
                method: "DELETE", 
            }),
            invalidatesTags: [{ type: "Property" }, { type: "Property", id: "ADMIN" }]
        })
    })
})

  export const {useDeletepropertyMutation} = deleteproperty;