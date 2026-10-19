import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Avatar, Button, Modal, Form, Input } from 'antd';
import { LockOutlined } from "@ant-design/icons";
import {
  HiOutlineBars3,
  HiOutlineBell,
  HiChevronDown,
  HiOutlineUser,
  HiOutlineKey,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useState } from "react";
import { useGetProfileQuery } from "../redux/features/auth/profile/getProfile";
import url from "../redux/api/baseUrl";
import { useChangePasswordMutation } from "../redux/features/auth/changePassword";
import toast, { Toaster } from "react-hot-toast";
import { confirmLogout } from "./Sidebar";

const pageTitles = {
  home: "Dashboard",
  banner: "Banner",
  user: "Users",
  earning: "Earning",
  property: "Property",
  landlord: "Landlord",
  contact: "Contact Info",
  settings: "Settings",
  profile: "Profile",
  notification: "Notifications",
};

const passwordInputClass = "!h-11 !rounded-lg";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('')

  const { data: user } = useGetProfileQuery()
  const [passwordChange, { isLoading }] = useChangePasswordMutation()

  const profile = user?.data?.attributes?.user;
  const section = pathname.split("/")[2];
  const title = pageTitles[section] || "Dashboard";

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    form.resetFields();
  };

  const changePassword = async (values) => {
    const { confirmPassword, ...ChangePassword } = values;
    setError('');
    try {
      const res = await passwordChange(ChangePassword).unwrap();
      if (res?.code == 200) {
        closeModal();
        toast.success(res?.message)
      }
    } catch (error) {
      setError(error?.data?.message || 'Could not change password. Please try again.')
    }
  };

  const menuItems = [
    {
      key: "profile",
      icon: <HiOutlineUser size={16} />,
      label: <Link to="/dashboard/profile">Profile</Link>,
    },
    {
      key: "password",
      icon: <HiOutlineKey size={16} />,
      label: "Change Password",
      onClick: () => setIsModalOpen(true),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <HiOutlineArrowRightOnRectangle size={16} />,
      label: "Log out",
      danger: true,
      onClick: () => confirmLogout(navigate),
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 overflow-hidden bg-gradient-to-r from-[#047A3E] via-[#059347] to-[#00A857] px-4 text-white shadow-[0_8px_24px_-12px_rgba(5,147,71,0.6)] sm:px-6 lg:px-8">
      <Toaster />
      {/* Decorative rings */}
      <div className="pointer-events-none absolute -right-10 -top-24 h-56 w-56 rounded-full border-[28px] border-white/[0.06]" />
      <div className="pointer-events-none absolute right-48 -bottom-28 h-48 w-48 rounded-full bg-white/[0.05]" />

      <div className="relative flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="-ml-1 rounded-lg p-2 text-white hover:bg-white/15 lg:hidden"
        >
          <HiOutlineBars3 size={22} />
        </button>
        <div className="min-w-0">
          <p className="hidden truncate text-xs font-medium text-white/80 sm:block">
            Welcome back{profile?.fullName ? `, ${profile.fullName}` : ""} 👋
          </p>
          <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
        </div>
      </div>

      <div className="relative flex items-center gap-2 sm:gap-3">
        <Link
          to="/dashboard/notification"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20 transition-colors hover:bg-white/25"
        >
          <HiOutlineBell size={20} />
        </Link>

        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <button
            type="button"
            className="flex items-center gap-3 rounded-full bg-white/15 py-1 pl-1 pr-1 ring-1 ring-white/20 transition-colors hover:bg-white/25 sm:pr-3"
          >
            <Avatar
              size={36}
              src={profile?.image?.url ? url + profile.image.url : undefined}
              className="!bg-white !text-[#059347] !font-semibold"
            >
              {profile?.fullName?.[0]?.toUpperCase()}
            </Avatar>
            <span className="hidden text-left sm:block">
              <span className="block max-w-[160px] truncate text-sm font-semibold leading-tight">{profile?.fullName}</span>
              <span className="block text-xs capitalize leading-tight text-white/75">{profile?.role || "Admin"}</span>
            </span>
            <HiChevronDown size={16} className="hidden text-white/80 sm:block" />
          </button>
        </Dropdown>
      </div>

      <Modal open={isModalOpen} onCancel={closeModal} footer={null} width={460} centered>
        <div className="pt-2">
          <h2 className="text-xl font-semibold text-gray-900">Change password</h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Use at least 8 characters, including a letter and a number.
          </p>
          <Form form={form} name="changePassword" layout="vertical" requiredMark={false} onFinish={changePassword}>
            <Form.Item
              name="oldPassword"
              label="Current password"
              rules={[{ required: true, message: "Please enter your current password" }]}
            >
              <Input.Password className={passwordInputClass} placeholder="Current password" prefix={<LockOutlined className="text-gray-400" />} />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New password"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 8, message: "Password must be at least 8 characters" },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: "Password must contain at least 1 letter and 1 number" },
              ]}
            >
              <Input.Password className={passwordInputClass} placeholder="New password" prefix={<LockOutlined className="text-gray-400" />} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm new password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password className={passwordInputClass} placeholder="Confirm new password" prefix={<LockOutlined className="text-gray-400" />} />
            </Form.Item>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <Button onClick={closeModal} className="!h-10">Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="!h-10 !bg-primaryBg hover:!bg-primaryBgDark !font-medium"
              >
                Update password
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
