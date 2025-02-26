import { apiSlice } from "../../../api/apiSlice";

 

const updateUser = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: ({formData , id}) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: formData
            }),
            invalidatesTags: [{type: "About"}]
        })
    })
})

export const {useUpdateUserMutation} = updateUser;