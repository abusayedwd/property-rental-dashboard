import { apiSlice } from "../../../api/apiSlice";

const getProfile = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => `/users/logedUser`,
            providesTags: [{type: "About"}]
        })
    })
})

export const {useGetProfileQuery} = getProfile;