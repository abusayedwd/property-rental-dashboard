import { apiSlice } from "../../api/apiSlice";

const adminProperties = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Every listing, including hidden ones, with open-report counts
        getAdminProperties: builder.query({
            query: () => `/property/admin/all`,
            providesTags: [{ type: "Property", id: "ADMIN" }],
        }),
        // body: { status: "active" | "hidden", reason }
        moderateProperty: builder.mutation({
            query: ({ id, status, reason }) => ({ url: `/property/${id}/moderation`, method: "PATCH", body: { status, reason } }),
            invalidatesTags: [{ type: "Property", id: "ADMIN" }, { type: "Report" }],
        }),
        // status: open | resolved | dismissed | undefined (all)
        getReports: builder.query({
            query: (status) => `/reports${status ? `?status=${status}` : ""}`,
            providesTags: [{ type: "Report" }],
        }),
        reviewReport: builder.mutation({
            query: ({ id, status, adminNote, hideListing }) => ({ url: `/reports/${id}`, method: "PATCH", body: { status, adminNote, hideListing } }),
            invalidatesTags: [{ type: "Report" }, { type: "Property", id: "ADMIN" }],
        }),
    }),
});

export const { useGetAdminPropertiesQuery, useModeratePropertyMutation, useGetReportsQuery, useReviewReportMutation } = adminProperties;
