import { apiSlice } from "../../api/apiSlice";
import { buildQuery } from "./getAllUsers";

const getAllLandlord = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllLandlord: builder.query({
            query: (params) => buildQuery("landlord", typeof params === "string" ? { name: params } : params),
            providesTags: [{type: "Users"}]
        })
    })
})

export const {useGetAllLandlordQuery} = getAllLandlord;
