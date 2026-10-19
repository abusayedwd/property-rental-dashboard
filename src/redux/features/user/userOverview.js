import { apiSlice } from "../../api/apiSlice";

// Profile + activity for the user details modal (admin only)
const userOverview = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserOverview: builder.query({
            query: (id) => `/users/${id}/overview`,
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),
    }),
});

export const { useGetUserOverviewQuery } = userOverview;
