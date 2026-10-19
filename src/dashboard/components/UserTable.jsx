import { useEffect, useState } from "react";
import { Avatar, Input, Modal, Table, Tag, Tooltip } from "antd";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineMagnifyingGlass, HiOutlineNoSymbol, HiOutlineCheckCircle } from "react-icons/hi2";
import url from "../../redux/api/baseUrl";
import { useBlockUnblockUserMutation } from "../../redux/features/user/blockUnblockUser";
import UserDetailsModal from "./UserDetailsModal";

const PAGE_SIZE = 10;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

/**
 * Searchable, paginated user table with the details modal.
 * `useListQuery` is the RTK hook to call with { name, page, limit }.
 */
const UserTable = ({ title, subtitle, useListQuery, showCompany = false }) => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isFetching } = useListQuery({ name: debounced, page, limit: PAGE_SIZE });
  const result = data?.data?.attributes;
  const users = result?.results || [];
  const total = result?.totalResults || 0;

  const [toggleBlock] = useBlockUnblockUserMutation();

  const confirmBlock = (record) => {
    Modal.confirm({
      title: record.isBlocked ? `Unblock ${record.fullName}?` : `Block ${record.fullName}?`,
      content: record.isBlocked
        ? "They will be able to log in and use the platform again."
        : "They won't be able to log in until you unblock them.",
      okText: record.isBlocked ? "Unblock" : "Block",
      okButtonProps: { danger: !record.isBlocked },
      centered: true,
      onOk: async () => {
        try {
          const res = await toggleBlock(record.id).unwrap();
          toast.success(res?.message || "Updated");
        } catch (error) {
          toast.error(error?.data?.message || "Could not update the user");
        }
      },
    });
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 56,
      render: (_, __, index) => <span className="text-gray-400">{(page - 1) * PAGE_SIZE + index + 1}</span>,
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <button type="button" onClick={() => setSelectedId(record.id)} className="flex items-center gap-3 text-left">
          <Avatar src={record.image?.url ? url + record.image.url : undefined} className="!bg-primaryBg shrink-0">
            {record.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <span className="min-w-0">
            <span className="block truncate font-medium text-gray-900 hover:text-primaryBgDark">{record.fullName || "—"}</span>
            <span className="block truncate text-xs text-gray-500">{record.email}</span>
          </span>
        </button>
      ),
    },
    { title: "Phone", key: "phone", responsive: ["md"], render: (_, r) => r.phoneNumber || <span className="text-gray-300">—</span> },
    ...(showCompany
      ? [{ title: "Company", key: "company", responsive: ["lg"], render: (_, r) => r.company || <span className="text-gray-300">—</span> }]
      : []),
    {
      title: "Location",
      key: "location",
      responsive: ["lg"],
      render: (_, r) => [r.city, r.distric].filter(Boolean).join(", ") || <span className="text-gray-300">—</span>,
    },
    { title: "Joined", key: "joined", responsive: ["sm"], render: (_, r) => formatDate(r.createdAt) },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={r.isBlocked ? "red" : "green"} className="!m-0 !rounded-full !px-2.5">
          {r.isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="View details">
            <button
              type="button"
              onClick={() => setSelectedId(record.id)}
              aria-label="View details"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primarySoft hover:text-primaryBgDark"
            >
              <HiOutlineEye size={18} />
            </button>
          </Tooltip>
          <Tooltip title={record.isBlocked ? "Unblock" : "Block"}>
            <button
              type="button"
              onClick={() => confirmBlock(record)}
              aria-label={record.isBlocked ? "Unblock" : "Block"}
              className={`rounded-lg p-2 transition-colors ${
                record.isBlocked ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              {record.isBlocked ? <HiOutlineCheckCircle size={18} /> : <HiOutlineNoSymbol size={18} />}
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {title} <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{total}</span>
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<HiOutlineMagnifyingGlass className="text-gray-400" />}
          placeholder="Search by name"
          className="!w-full sm:!w-64"
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={isFetching}
        scroll={{ x: "max-content" }}
        onRow={(record) => ({ onDoubleClick: () => setSelectedId(record.id) })}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: setPage,
          showTotal: (t, range) => `${range[0]}–${range[1]} of ${t}`,
          className: "!px-5",
        }}
      />

      <UserDetailsModal userId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default UserTable;
