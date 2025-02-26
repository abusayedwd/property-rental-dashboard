
import { apiSlice } from "../../api/apiSlice";

const getAllLandlord = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllLandlord: builder.query({
            query: (name) => `/users/getAllUsers?role=landlord&fullName=${name}`,
            providesTags: [{type: "Users"}]
        })
    })
})

export const {useGetAllLandlordQuery} = getAllLandlord;