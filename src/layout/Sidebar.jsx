import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../public/image/logo.png'
import Swal from "sweetalert2";
import { Avatar } from "antd";
import { useGetProfileQuery } from "../redux/features/auth/profile/getProfile";
import url from "../redux/api/baseUrl";
import {
  HiOutlineSquares2X2,
  HiOutlinePhoto,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineHomeModern,
  HiOutlineKey,
  HiOutlinePhone,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const navItems = [
  { to: "home", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { to: "banner", label: "Banner", icon: HiOutlinePhoto },
  { to: "user", label: "Users", icon: HiOutlineUsers },
  { to: "earning", label: "Earning", icon: HiOutlineBanknotes },
  { to: "property", label: "Property", icon: HiOutlineHomeModern },
  { to: "landlord", label: "Landlord", icon: HiOutlineKey },
  { to: "contact", label: "Contact Info", icon: HiOutlinePhone },
  { to: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

export const confirmLogout = (navigate) => {
  Swal.fire({
    title: "Log out?",
    text: "You will be signed out of the dashboard.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#00BF63",
    cancelButtonColor: "#9CA3AF",
    confirmButtonText: "Log out",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  });
};

const Sidebar = () => {
  const navigate = useNavigate();

  const { data: user } = useGetProfileQuery();
  const profile = user?.data?.attributes?.user;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#1F2B5C] via-[#171F3D] to-[#0F1530] text-white shadow-2xl">
      {/* Soft brand glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#00BF63]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#00BF63]/10 blur-3xl" />

      <div className="relative flex h-[76px] items-center px-6">
        <img className="h-6 w-auto" src={logo} alt="MyNextHome" />
      </div>
      <div className="relative mx-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <nav className="relative flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Main menu
        </p>
        <ul className="space-y-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#00BF63] to-[#059347] text-white shadow-lg shadow-[#00BF63]/25"
                      : "text-white/65 hover:translate-x-0.5 hover:bg-white/[0.07] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive ? "bg-white/20" : "bg-white/[0.06] group-hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              src={profile?.image?.url ? url + profile.image.url : undefined}
              className="!bg-[#00BF63] ring-2 ring-white/20"
            >
              {profile?.fullName?.[0]?.toUpperCase()}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{profile?.fullName || "Admin"}</p>
              <p className="truncate text-xs text-white/50">{profile?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => confirmLogout(navigate)}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg p-2 text-white/60 transition-colors hover:bg-red-500/15 hover:text-red-400"
            >
              <HiOutlineArrowRightOnRectangle size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
