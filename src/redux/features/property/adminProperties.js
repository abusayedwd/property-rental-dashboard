import { apiSlice } from "../../api/apiSlice";

const adminProperties = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Every listing, including hidden ones, with open-report counts
        getAdminProperties: builder.query({
            query: () => `/property/admin/all`,
            providesTags: [{ type: "Property", id: "ADMIN" }],
        }),
        // body: { status: "active" | "hidden" | "rejected", reason }  (active = approve)
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
        // Owner verification (NID) requests. status: pending | verified | rejected | undefined (all)
        getVerifications: builder.query({
            query: (status) => `/verification${status ? `?status=${status}` : ""}`,
            providesTags: [{ type: "Verification" }],
        }),
        reviewVerification: builder.mutation({
            query: ({ id, status, adminNote }) => ({ url: `/verification/${id}`, method: "PATCH", body: { status, adminNote } }),
            invalidatesTags: [{ type: "Verification" }],
        }),
    }),
});

export const {
    useGetAdminPropertiesQuery,
    useModeratePropertyMutation,
    useGetReportsQuery,
    useReviewReportMutation,
    useGetVerificationsQuery,
    useReviewVerificationMutation,
} = adminProperties;
