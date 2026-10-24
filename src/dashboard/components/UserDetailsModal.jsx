import { Avatar, Button, Empty, Modal, Skeleton, Tabs, Tag, Tooltip } from "antd";
import toast from "react-hot-toast";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineLanguage,
  HiOutlineUser,
  HiOutlineHomeModern,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
  HiOutlineBolt,
  HiOutlineArchiveBox,
  HiOutlineGlobeAlt,
  HiOutlineNoSymbol,
  HiOutlineCheckCircle,
  HiCheckBadge,
  HiOutlineClipboardDocument,
  HiOutlineUsers,
} from "react-icons/hi2";
import { FaWhatsapp, FaFacebook, FaLinkedin } from "react-icons/fa";
import url from "../../redux/api/baseUrl";
import { useGetUserOverviewQuery } from "../../redux/features/user/userOverview";
import { useBlockUnblockUserMutation } from "../../redux/features/user/blockUnblockUser";
import { mediaUrl } from "../../utils/media";

const ROLE = {
  user: { label: "Tenant / Buyer", color: "green" },
  landlord: { label: "Landlord", color: "blue" },
  admin: { label: "Admin", color: "purple" },
};
const STATUS = {
  rent: { label: "For Rent", color: "green" },
  sell: { label: "For Sale", color: "blue" },
  rented: { label: "Rented", color: "default" },
  sold: { label: "Sold", color: "default" },
};
const GENDER = { male: "Male", female: "Female", other: "Other" };
const CONTACT = { phone: "Phone call", whatsapp: "WhatsApp", message: "In-app message", email: "Email" };

const formatDate = (value, withTime = false) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};
const taka = (v) => (v || v === 0 ? `৳${Number(v).toLocaleString("en-IN")}` : null);
const withProtocol = (link) => (/^https?:\/\//i.test(link) ? link : `https://${link}`);
const waLink = (n) => {
  const d = String(n).replace(/\D/g, "");
  return `https://wa.me/${d.startsWith("0") ? "88" + d : d}`;
};

const copy = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    /* clipboard not available */
  }
};

const Field = ({ icon: Icon, label, value, copyable }) => (
  <div className="flex items-start gap-3 rounded-lg p-2.5">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
      <Icon size={16} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="flex items-center gap-1.5">
        <p className={`break-words text-sm ${value ? "font-medium text-gray-800" : "text-gray-400"}`}>{value || "Not provided"}</p>
        {copyable && value && (
          <button type="button" onClick={() => copy(value, label)} className="text-gray-300 hover:text-primaryBgDark" aria-label={`Copy ${label}`}>
            <HiOutlineClipboardDocument size={14} />
          </button>
        )}
      </div>
    </div>
  </div>
);

const Stat = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-3.5">
    <div className="flex items-center gap-2">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
        <Icon size={16} />
      </span>
      <p className="text-xs font-medium text-gray-500">{label}</p>
    </div>
    <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400 first:mt-0">{children}</h4>
);

const PropertyRow = ({ property, meta }) => {
  const status = STATUS[property.propertyType] || { label: property.propertyType, color: "default" };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5">
      <img
        src={mediaUrl(property.image) || "/image/service.jpg"}
        alt=""
        className="h-12 w-16 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">{property.houseName}</p>
        <p className="truncate text-xs text-gray-500">
          {[property.subState, property.state].filter(Boolean).join(", ") || "—"} · {meta}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-gray-900">{taka(property.price)}</span>
        <div className="flex gap-1">
          {property.isPromotion && <Tag color="gold" className="!m-0 !text-[10px]">Featured</Tag>}
          <Tag color={status.color} className="!m-0 !text-[10px]">{status.label}</Tag>
        </div>
      </div>
    </div>
  );
};

const ModalSkeleton = () => (
  <div className="p-6">
    <div className="flex items-center gap-4">
      <Skeleton.Avatar active size={72} />
      <Skeleton active title={{ width: 200 }} paragraph={{ rows: 1, width: 150 }} />
    </div>
    <Skeleton active className="mt-6" paragraph={{ rows: 6 }} />
  </div>
);

/** Admin modal with a user's full profile and activity. `userId` null = closed. */
const UserDetailsModal = ({ userId, onClose }) => {
  const { data, isFetching, isError } = useGetUserOverviewQuery(userId, { skip: !userId });
  const [toggleBlock, { isLoading: isToggling }] = useBlockUnblockUserMutation();

  const overview = data?.data?.attributes;
  const user = overview?.user;
  const stats = overview?.stats || {};
  const isLandlord = user?.role === "landlord";
  const role = ROLE[user?.role] || { label: user?.role, color: "default" };
  const address = user && [user.street, user.streetName, user.city, user.distric].filter(Boolean).join(", ");

  const handleBlock = () => {
    Modal.confirm({
      title: user.isBlocked ? `Unblock ${user.fullName}?` : `Block ${user.fullName}?`,
      content: user.isBlocked
        ? "They will be able to log in and use the platform again."
        : "They won't be able to log in until you unblock them.",
      okText: user.isBlocked ? "Unblock" : "Block",
      okButtonProps: { danger: !user.isBlocked },
      centered: true,
      onOk: async () => {
        try {
          const res = await toggleBlock(user.id).unwrap();
          toast.success(res?.message || "Updated");
        } catch (error) {
          toast.error(error?.data?.message || "Could not update the user");
        }
      },
    });
  };

  const socials = user
    ? [
        user.whatsappNumber && { icon: FaWhatsapp, className: "text-[#25D366]", label: "WhatsApp", href: waLink(user.whatsappNumber) },
        user.website && { icon: HiOutlineGlobeAlt, className: "text-gray-600", label: "Website", href: withProtocol(user.website) },
        user.facebook && { icon: FaFacebook, className: "text-[#1877F2]", label: "Facebook", href: withProtocol(user.facebook) },
        user.linkedin && { icon: FaLinkedin, className: "text-[#0A66C2]", label: "LinkedIn", href: withProtocol(user.linkedin) },
      ].filter(Boolean)
    : [];

  const profileTab = user && (
    <div>
      {user.bio && (
        <>
          <SectionTitle>About</SectionTitle>
          <p className="whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">{user.bio}</p>
        </>
      )}

      <SectionTitle>Contact</SectionTitle>
      <div className="grid gap-x-2 md:grid-cols-2">
        <Field icon={HiOutlineEnvelope} label="Email" value={user.email} copyable />
        <Field icon={HiOutlinePhone} label="Phone" value={user.phoneNumber} copyable />
        <Field icon={FaWhatsapp} label="WhatsApp" value={user.whatsappNumber} copyable />
        <Field icon={HiOutlinePhone} label="Alternate phone" value={user.alternatePhone} copyable />
        <Field icon={HiOutlineChatBubbleLeftRight} label="Preferred contact" value={CONTACT[user.preferredContact]} />
        <Field icon={HiOutlineMapPin} label="Address" value={address} />
      </div>

      <SectionTitle>Personal</SectionTitle>
      <div className="grid gap-x-2 md:grid-cols-2">
        <Field icon={HiOutlineUser} label="Gender" value={GENDER[user.gender]} />
        <Field icon={HiOutlineCalendarDays} label="Date of birth" value={formatDate(user.dataOfBirth)} />
        <Field icon={HiOutlineBriefcase} label="Occupation" value={user.occupation} />
        <Field icon={HiOutlineBuildingOffice2} label="Company" value={user.company} />
        <Field icon={HiOutlineLanguage} label="Languages" value={user.languages?.length ? user.languages.join(", ") : null} />
        {isLandlord && (
          <Field icon={HiOutlineBriefcase} label="Experience" value={user.experienceYears ? `${user.experienceYears} years` : null} />
        )}
      </div>

      {!isLandlord && (
        <>
          <SectionTitle>Looking for</SectionTitle>
          <div className="grid gap-x-2 md:grid-cols-2">
            <Field icon={HiOutlineHomeModern} label="Wants to" value={user.lookingFor && (user.lookingFor === "buy" ? "Buy" : "Rent")} />
            <Field icon={HiOutlineHomeModern} label="Property type" value={user.preferredPropertyType} />
            <Field icon={HiOutlineMapPin} label="Preferred district" value={user.preferredDistrict} />
            <Field icon={HiOutlineBanknotes} label="Max budget" value={taka(user.budgetMax)} />
            <Field icon={HiOutlineUsers} label="Household size" value={user.householdSize} />
          </div>
        </>
      )}

      <SectionTitle>Account</SectionTitle>
      <div className="grid gap-x-2 md:grid-cols-2">
        <Field icon={HiOutlineCalendarDays} label="Joined" value={formatDate(user.createdAt, true)} />
        <Field icon={HiOutlineCalendarDays} label="Last updated" value={formatDate(user.updatedAt, true)} />
        <Field icon={HiOutlineCheckCircle} label="Email verified" value={user.isEmailVerified ? "Yes" : "No"} />
        <Field icon={HiOutlineClipboardDocument} label="User ID" value={user.id} copyable />
      </div>
    </div>
  );

  const activityTab = (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {isLandlord ? (
          <>
            <Stat icon={HiOutlineHomeModern} label="Listings" value={stats.properties ?? 0} accent="bg-primarySoft text-primaryBgDark" />
            <Stat icon={HiOutlineBolt} label="Featured" value={stats.featuredProperties ?? 0} accent="bg-amber-50 text-amber-600" />
            <Stat icon={HiOutlineArchiveBox} label="Rented / Sold" value={stats.closedProperties ?? 0} accent="bg-gray-100 text-gray-600" />
            <Stat icon={HiOutlineBanknotes} label="Paid" value={`৳${Number(stats.totalPaid ?? 0).toLocaleString("en-IN")}`} accent="bg-blue-50 text-blue-600" />
          </>
        ) : (
          <>
            <Stat icon={HiOutlineHeart} label="Saved homes" value={stats.favorites ?? 0} accent="bg-red-50 text-red-500" />
            <Stat icon={HiOutlineChatBubbleLeftRight} label="Conversations" value={stats.conversations ?? 0} accent="bg-blue-50 text-blue-600" />
            <Stat icon={HiOutlineBanknotes} label="Budget" value={taka(user?.budgetMax) || "—"} accent="bg-primarySoft text-primaryBgDark" />
            <Stat icon={HiOutlineMapPin} label="Wants area" value={user?.preferredDistrict || "—"} accent="bg-amber-50 text-amber-600" />
          </>
        )}
      </div>

      {isLandlord ? (
        <>
          <SectionTitle>Recent listings</SectionTitle>
          {overview?.recentProperties?.length ? (
            <div className="space-y-2">
              {overview.recentProperties.map((p) => (
                <PropertyRow key={p.id} property={p} meta={`Listed ${formatDate(p.createdAt)}`} />
              ))}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No listings yet" />
          )}

          <SectionTitle>Promotion payments</SectionTitle>
          {overview?.recentPayments?.length ? (
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
              {overview.recentPayments.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-3 py-2.5 text-sm">
                  <span className="text-gray-600">{formatDate(t.createdAt, true)}</span>
                  <span className="flex items-center gap-2">
                    <Tag color={t.promotionStatus === "active" ? "green" : t.status === "failed" ? "red" : "default"} className="!m-0 capitalize">
                      {t.promotionStatus || t.status}
                    </Tag>
                    <span className="font-semibold text-gray-900">
                      {t.currency === "USD" ? "$" : "৳"}{Number(t.amount).toLocaleString("en-IN")}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No payments yet" />
          )}
        </>
      ) : (
        <>
          <SectionTitle>Recently saved homes</SectionTitle>
          {overview?.recentFavorites?.length ? (
            <div className="space-y-2">
              {overview.recentFavorites.map((p) => (
                <PropertyRow key={p.id} property={p} meta={`Saved ${formatDate(p.favoritedAt)}`} />
              ))}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No saved homes yet" />
          )}
        </>
      )}
    </div>
  );

  return (
    <Modal
      open={!!userId}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnClose
      styles={{ content: { padding: 0, overflow: "hidden" } }}
    >
      {isFetching && !user ? (
        <ModalSkeleton />
      ) : isError || !user ? (
        <div className="p-10">
          <Empty description="Could not load this user" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#171F3D] via-[#222F55] to-[#059347] px-6 pb-5 pt-6 text-white">
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar
                size={76}
                src={mediaUrl(user.image?.url) || undefined}
                className="shrink-0 border-[3px] border-white/80 !bg-primaryBg !text-2xl shadow-lg"
              >
                {user.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-xl font-semibold">{user.fullName || "Unnamed user"}</h3>
                  {user.isEmailVerified && (
                    <Tooltip title="Email verified">
                      <HiCheckBadge size={20} className="text-[#4ade80]" />
                    </Tooltip>
                  )}
                </div>
                <p className="truncate text-sm text-white/70">{user.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Tag color={role.color} className="!m-0 !border-0">{role.label}</Tag>
                  <Tag color={user.isBlocked ? "red" : "green"} className="!m-0 !border-0">
                    {user.isBlocked ? "Blocked" : "Active"}
                  </Tag>
                  <Tag className="!m-0 !border-0 !bg-white/15 !text-white">Joined {formatDate(user.createdAt)}</Tag>
                </div>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="relative mt-4 flex flex-wrap gap-2">
                {socials.map(({ icon: Icon, className, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Icon className={className} size={14} /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto px-6 pb-2 pt-1">
            <Tabs
              defaultActiveKey="profile"
              items={[
                { key: "profile", label: "Profile", children: profileTab },
                { key: "activity", label: isLandlord ? "Listings & payments" : "Activity", children: activityTab },
              ]}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-3">
            <p className="text-xs text-gray-400">ID: {user.id}</p>
            <div className="flex gap-2">
              <Button onClick={onClose}>Close</Button>
              <Button
                danger={!user.isBlocked}
                type={user.isBlocked ? "primary" : "default"}
                loading={isToggling}
                onClick={handleBlock}
                icon={user.isBlocked ? <HiOutlineCheckCircle size={16} /> : <HiOutlineNoSymbol size={16} />}
                className="!flex items-center"
              >
                {user.isBlocked ? "Unblock user" : "Block user"}
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
