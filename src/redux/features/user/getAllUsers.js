import { apiSlice } from "../../api/apiSlice";

const getAllUsers = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: (name) => `/users/getAllUsers?role=user&fullName=${name}`,
            providesTags: [{type: "Users"}]
        })
    })
})

export const {useGetAllUsersQuery} = getAllUsers;