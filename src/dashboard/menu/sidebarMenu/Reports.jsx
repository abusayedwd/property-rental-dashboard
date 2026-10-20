import { useState } from "react";
import { Avatar, Button, Empty, Input, Modal, Segmented, Skeleton, Tag } from "antd";
import toast from "react-hot-toast";
import { HiOutlineFlag, HiOutlineEyeSlash, HiOutlineCheck, HiOutlineXMark, HiOutlineMapPin } from "react-icons/hi2";
import url from "../../../redux/api/baseUrl";
import { useGetReportsQuery, useReviewReportMutation } from "../../../redux/features/property/adminProperties";

const REASON = {
  fake: "Fake listing or photos",
  scam: "Looks like a scam",
  wrong_info: "Wrong price or details",
  unavailable: "Already rented or sold",
  offensive: "Offensive or inappropriate",
  other: "Something else",
};
const STATUS_COLOR = { open: "orange", resolved: "green", dismissed: "default" };

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// Admin review of listings reported by users
const Reports = () => {
  const [status, setStatus] = useState("open");
  const { data, isFetching } = useGetReportsQuery(status);
  const [reviewReport, { isLoading: saving }] = useReviewReportMutation();
  const [action, setAction] = useState(null); // { report, kind: "hide" | "resolve" | "dismiss" }
  const [note, setNote] = useState("");

  const reports = data?.data?.attributes?.reports || [];
  const counts = data?.data?.attributes?.counts || {};

  const submit = async () => {
    const { report, kind } = action;
    try {
      await reviewReport({
        id: report.id,
        status: kind === "dismiss" ? "dismissed" : "resolved",
        adminNote: note.trim() || undefined,
        hideListing: kind === "hide",
      }).unwrap();
      toast.success(kind === "hide" ? "Listing hidden and report resolved" : kind === "dismiss" ? "Report dismissed" : "Report resolved");
      setAction(null);
      setNote("");
    } catch (error) {
      toast.error(error?.data?.message || "Could not update the report");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reported listings</h2>
          <p className="text-sm text-gray-500">Reports from users about fake, wrong or unsafe listings.</p>
        </div>
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { value: "open", label: `Open${counts.open ? ` (${counts.open})` : ""}` },
            { value: "resolved", label: "Resolved" },
            { value: "dismissed", label: "Dismissed" },
          ]}
        />
      </div>

      {isFetching && !reports.length ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-white p-5 shadow-card"><Skeleton active avatar paragraph={{ rows: 3 }} /></div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-14 shadow-card">
          <Empty description={status === "open" ? "No open reports. Nice and clean!" : `No ${status} reports`} />
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const property = report.propertyId;
            const hidden = property?.moderation?.status === "hidden";
            return (
              <article key={report.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
                <div className="flex flex-col gap-4 p-5 md:flex-row">
                  <img
                    src={property?.images?.[0]?.url ? url + property.images[0].url : "/image/service.jpg"}
                    alt=""
                    className="h-32 w-full shrink-0 rounded-lg object-cover md:h-24 md:w-36"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="line-clamp-1 font-semibold text-gray-900">{property?.houseName || "Listing deleted"}</h3>
                      {hidden && <Tag color="red" className="!m-0">Hidden</Tag>}
                      <Tag color={STATUS_COLOR[report.status]} className="!m-0 capitalize">{report.status}</Tag>
                    </div>
                    {property && (
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                        <HiOutlineMapPin size={14} />
                        {[property.subState, property.state].filter(Boolean).join(", ")} · Owner: {property.landlordId?.fullName || "—"}
                      </p>
                    )}
                    <div className="mt-3 rounded-lg bg-red-50/60 px-3 py-2">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-red-700">
                        <HiOutlineFlag size={15} /> {REASON[report.reason] || report.reason}
                      </p>
                      {report.details && <p className="mt-1 text-sm text-gray-700">{report.details}</p>}
                    </div>
                    {report.adminNote && <p className="mt-2 text-sm text-gray-500"><span className="font-medium text-gray-700">Admin note:</span> {report.adminNote}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Avatar size={26} src={report.reporterId?.image?.url ? url + report.reporterId.image.url : undefined} className="!bg-primaryBg !text-xs">
                      {report.reporterId?.fullName?.[0]?.toUpperCase()}
                    </Avatar>
                    Reported by <span className="font-medium text-gray-800">{report.reporterId?.fullName || "—"}</span>
                    <span className="text-gray-400">· {formatDate(report.createdAt)}</span>
                  </div>
                  {report.status === "open" && property && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" icon={<HiOutlineXMark size={14} />} onClick={() => setAction({ report, kind: "dismiss" })} className="!flex !items-center">
                        Dismiss
                      </Button>
                      <Button size="small" icon={<HiOutlineCheck size={14} />} onClick={() => setAction({ report, kind: "resolve" })} className="!flex !items-center">
                        Resolve
                      </Button>
                      {!hidden && (
                        <Button size="small" danger type="primary" icon={<HiOutlineEyeSlash size={14} />} onClick={() => setAction({ report, kind: "hide" })} className="!flex !items-center">
                          Hide listing
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={!!action}
        onCancel={() => setAction(null)}
        onOk={submit}
        centered
        okText={action?.kind === "hide" ? "Hide listing" : action?.kind === "dismiss" ? "Dismiss report" : "Mark resolved"}
        okButtonProps={{ danger: action?.kind === "hide", loading: saving }}
        title={action?.kind === "hide" ? "Hide this listing?" : action?.kind === "dismiss" ? "Dismiss this report?" : "Resolve this report?"}
      >
        <p className="text-sm text-gray-500">
          {action?.kind === "hide"
            ? "The listing disappears from the website and the owner is notified. You can show it again from the Property page."
            : action?.kind === "dismiss"
              ? "Use this when the listing is fine. The reporter is told nothing was wrong."
              : "Use this when the issue was fixed another way. The listing stays visible."}
        </p>
        <Input.TextArea
          className="!mt-4"
          rows={3}
          maxLength={300}
          showCount
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={action?.kind === "hide" ? "Reason shown to the owner, e.g. “Photos don't match the address”" : "Internal note (optional)"}
        />
      </Modal>
    </div>
  );
};

export default Reports;
