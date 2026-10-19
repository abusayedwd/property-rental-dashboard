import { apiSlice } from "../../api/apiSlice";

// params: { name, page, limit } - lists tenants/buyers (role=user)
const buildQuery = (role, { name = "", page = 1, limit = 10 } = {}) =>
    `/users/getAllUsers?${new URLSearchParams({ role, fullName: name.trim(), page, limit, sortBy: "createdAt:desc" })}`;

const getAllUsers = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            // Older callers pass just a search string
            query: (params) => buildQuery("user", typeof params === "string" ? { name: params } : params),
            providesTags: [{type: "Users"}]
        })
    })
})

export const {useGetAllUsersQuery} = getAllUsers;
export { buildQuery };
