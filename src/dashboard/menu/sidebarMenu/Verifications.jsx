import { useState } from "react";
import { Avatar, Button, Empty, Input, Modal, Segmented, Skeleton, Tag } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineIdentification, HiOutlineCamera, HiOutlineShieldCheck, HiOutlineXMark, HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { useGetVerificationsQuery, useReviewVerificationMutation } from "../../../redux/features/property/adminProperties";
import url from "../../../redux/api/baseUrl";
import { mediaUrl } from "../../../utils/media";

const STATUS_TAG = {
  pending: <Tag color="orange">Pending</Tag>,
  verified: <Tag color="green">Verified</Tag>,
  rejected: <Tag color="red">Rejected</Tag>,
};

const formatDate = (d) => new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// NID photos are private: load them with the admin token instead of a public link
const usePrivatePhoto = () => {
  const [photo, setPhoto] = useState(null);
  const open = async (item, kind) => {
    try {
      const res = await fetch(`${url}/v1/verification/${item.id}/file/${kind}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || "Could not open the photo");
      const blob = await res.blob();
      setPhoto({ src: URL.createObjectURL(blob), title: `${item.userId?.fullName || "Owner"}: ${kind === "selfie" ? "selfie with NID" : "NID front"}` });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const close = () => {
    if (photo) URL.revokeObjectURL(photo.src);
    setPhoto(null);
  };
  return { photo, open, close };
};

const Verifications = () => {
  const [status, setStatus] = useState("pending");
  const { data, isLoading } = useGetVerificationsQuery(status === "all" ? undefined : status);
  const [review, { isLoading: saving }] = useReviewVerificationMutation();
  const { photo, open, close } = usePrivatePhoto();
  const items = data?.data?.attributes?.items || [];
  const counts = data?.data?.attributes?.counts || {};

  const decide = (item, decision) => {
    let note = "";
    Modal.confirm({
      title: decision === "verified" ? `Verify ${item.userId?.fullName || "this owner"}?` : "Reject this request?",
      content: (
        <div>
          <p className="mb-2 text-gray-500">
            {decision === "verified"
              ? "Check that the name and photo on the NID match the account. The owner gets the Verified badge, and the NID photos are deleted."
              : "Tell the owner what to fix. The NID photos are deleted and they can apply again."}
          </p>
          <Input.TextArea
            rows={2}
            maxLength={300}
            placeholder={decision === "verified" ? "Note (optional)" : "Reason shown to the owner, e.g. the photo is blurry"}
            onChange={(e) => (note = e.target.value)}
          />
        </div>
      ),
      okText: decision === "verified" ? "Verify owner" : "Reject",
      okButtonProps: { danger: decision !== "verified" },
      centered: true,
      onOk: async () => {
        try {
          await review({ id: item.id, status: decision, adminNote: note.trim() || undefined }).unwrap();
          toast.success(decision === "verified" ? "Owner verified" : "Request rejected");
        } catch (error) {
          toast.error(error?.data?.message || "Could not save the decision");
        }
      },
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <Toaster />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Owner verifications</h1>
          <p className="mt-1 text-sm text-gray-500">Landlords send their NID to get the Verified owner badge. Photos are deleted after you decide.</p>
        </div>
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { value: "pending", label: `Pending (${counts.pending || 0})` },
            { value: "verified", label: `Verified (${counts.verified || 0})` },
            { value: "rejected", label: `Rejected (${counts.rejected || 0})` },
            { value: "all", label: "All" },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-card"><Skeleton active avatar /></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white p-12 shadow-card">
          <Empty description={status === "pending" ? "No requests waiting for review" : "Nothing here yet"} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => {
            const user = item.userId || {};
            return (
              <div key={item.id} className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <Avatar size={48} src={mediaUrl(user.image?.url)} className="!bg-primaryBg shrink-0">
                    {user.fullName?.[0]?.toUpperCase()}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{user.fullName || "Unknown user"}</p>
                      {STATUS_TAG[item.status]}
                    </div>
                    <p className="flex items-center gap-1 truncate text-sm text-gray-500"><HiOutlineEnvelope /> {user.email}</p>
                    {user.phoneNumber && <p className="flex items-center gap-1 text-sm text-gray-500"><HiOutlinePhone /> {user.phoneNumber}</p>}
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                  <div>
                    <dt className="text-xs text-gray-500">Name on NID</dt>
                    <dd className={`font-medium ${user.fullName && item.fullNameOnId.toLowerCase() !== user.fullName.toLowerCase() ? "text-amber-600" : "text-gray-900"}`}>
                      {item.fullNameOnId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">NID number</dt>
                    <dd className="font-mono font-medium text-gray-900">{item.nidNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Sent</dt>
                    <dd className="text-gray-700">{formatDate(item.createdAt)}</dd>
                  </div>
                  {item.reviewedAt && (
                    <div>
                      <dt className="text-xs text-gray-500">Reviewed</dt>
                      <dd className="text-gray-700">{formatDate(item.reviewedAt)}</dd>
                    </div>
                  )}
                </dl>
                {item.adminNote && <p className="mt-2 text-xs text-gray-500">Note: {item.adminNote}</p>}

                {item.status === "pending" && (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button icon={<HiOutlineIdentification />} onClick={() => open(item, "document")} disabled={!item.hasDocument}>NID photo</Button>
                      <Button icon={<HiOutlineCamera />} onClick={() => open(item, "selfie")} disabled={!item.hasSelfie}>
                        {item.hasSelfie ? "Selfie" : "No selfie"}
                      </Button>
                    </div>
                    <div className="mt-auto flex gap-2 pt-4">
                      <Button
                        type="primary"
                        loading={saving}
                        icon={<HiOutlineShieldCheck />}
                        onClick={() => decide(item, "verified")}
                        className="!flex flex-1 items-center justify-center !bg-primaryBg"
                      >
                        Verify
                      </Button>
                      <Button danger icon={<HiOutlineXMark />} onClick={() => decide(item, "rejected")} className="!flex flex-1 items-center justify-center">
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={Boolean(photo)} onCancel={close} footer={null} title={photo?.title} width={720} centered destroyOnClose>
        {photo && <img src={photo.src} alt="" className="max-h-[70vh] w-full rounded-lg object-contain" />}
      </Modal>
    </div>
  );
};

export default Verifications;
