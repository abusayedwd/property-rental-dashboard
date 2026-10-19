import React from 'react';
import { Skeleton } from 'antd';
import { HiOutlineBanknotes, HiOutlineUsers, HiOutlineKey } from 'react-icons/hi2';
import { useGetStatusQuery } from '../../redux/features/user/getStatus';

const formatNumber = (value) => Number(value || 0).toLocaleString();

const StatCard = ({ label, value, icon: Icon, accent, loading }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-card">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
      <Icon size={24} />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {loading ? (
        <Skeleton.Input active size="small" className="!mt-1 !h-7 !w-24 !min-w-0" />
      ) : (
        <p className="mt-0.5 truncate text-2xl font-semibold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

const Card = () => {
  const { data: status, isLoading } = useGetStatusQuery()
  const stats = status?.data?.attributes;

  const cards = [
    {
      label: 'Total Earnings',
      value: `$${Number(stats?.totalAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: HiOutlineBanknotes,
      accent: 'bg-primarySoft text-primaryBgDark',
    },
    {
      label: 'Total Users',
      value: formatNumber(stats?.users),
      icon: HiOutlineUsers,
      accent: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Landlords',
      value: formatNumber(stats?.landLord),
      icon: HiOutlineKey,
      accent: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} loading={isLoading} />
      ))}
    </div>
  );
};

export default Card;
