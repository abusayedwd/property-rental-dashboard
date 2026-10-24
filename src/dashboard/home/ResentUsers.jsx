import { Avatar, Table, Tooltip } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineEye, HiArrowRight } from "react-icons/hi2";
import { useGetAllUsersQuery } from "../../redux/features/user/getAllUsers";
import url from "../../redux/api/baseUrl";
import UserDetailsModal from "../components/UserDetailsModal";
import { mediaUrl } from "../../utils/media";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const ResentUser = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { data: userss, isLoading } = useGetAllUsersQuery({ page: 1, limit: 5 })
  const users = userss?.data?.attributes?.results

  const handleView = (value) => setSelectedId(value.id);

  const columns = [
    {
      title: "User",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={mediaUrl(record?.image?.url) || undefined} className="!bg-primaryBg">
            {record?.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <span className="font-medium text-gray-900">{record?.fullName || "—"}</span>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record?.email || "—",
    },
    {
      title: "Phone",
      key: "phone",
      responsive: ["md"],
      render: (_, record) => record?.phoneNumber || "—",
    },
    {
      title: "Joined",
      key: "date",
      responsive: ["sm"],
      render: (_, record) => formatDate(record?.createdAt),
    },
    {
      title: "",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Tooltip title="View details">
          <button
            type="button"
            onClick={() => handleView(record)}
            aria-label="View details"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primarySoft hover:text-primaryBgDark"
          >
            <HiOutlineEye size={18} />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Recent users</h2>
          <p className="mt-0.5 text-sm text-gray-500">Latest people who joined the platform</p>
        </div>
        <Link
          to="/dashboard/user"
          className="flex items-center gap-1 text-sm font-medium text-primaryBgDark hover:underline"
        >
          View all <HiArrowRight size={14} />
        </Link>
      </div>
      <Table
        rowKey={(record) => record?.id || record?._id || record?.email}
        columns={columns}
        dataSource={users?.slice(0, 5)}
        loading={isLoading}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <UserDetailsModal userId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default ResentUser;
