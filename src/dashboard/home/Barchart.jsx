import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, Skeleton } from 'antd';
import { useChatEarningQuery } from '../../redux/features/earning/monthlyEarning';

// Line uses the darker brand green: #00BF63 is below 3:1 contrast on white
const LINE = '#059347';
const FILL = '#00BF63';
const FIRST_YEAR = 2024;
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => {
  const y = String(currentYear - i);
  return { value: y, label: y };
});

const formatMoney = (value) =>
  `৳${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const formatAxis = (value) =>
  `৳${Intl.NumberFormat("en-IN", { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;

const CustomTooltip = ({ active, payload, label, year }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-500">{label} {year}</p>
      <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatMoney(payload[0].value)}</p>
    </div>
  );
};

const Summary = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

const Barchart = () => {
  const [year, setYear] = useState(String(currentYear))
  const { data: earnings, isFetching } = useChatEarningQuery(year)

  const chartData = useMemo(
    () => (earnings?.data?.attributes || []).map((d) => ({ month: d.month, total: Number(d.totalEarnings) || 0 })),
    [earnings]
  );

  const total = chartData.reduce((sum, d) => sum + d.total, 0);
  const best = chartData.reduce((max, d) => (d.total > (max?.total ?? 0) ? d : max), null);
  // Average over months elapsed so far for the current year
  const monthsElapsed = Number(year) === currentYear ? new Date().getMonth() + 1 : 12;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Earnings overview</h2>
          <p className="mt-0.5 text-sm text-gray-500">Monthly revenue from successful payments</p>
        </div>
        <Select value={year} onChange={setYear} options={yearOptions} className="w-28" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-b border-gray-100 pb-5">
        <Summary label={`Total ${year}`} value={formatMoney(total)} />
        <Summary label="Best month" value={best ? `${best.month} · ${formatAxis(best.total)}` : '—'} />
        <Summary label="Monthly average" value={formatMoney(total / monthsElapsed)} />
      </div>

      <div className="relative mt-4 h-[300px]">
        {isFetching && !chartData.length ? (
          <Skeleton active paragraph={{ rows: 7 }} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={FILL} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={FILL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#EEF0F4" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={formatAxis}
                  width={56}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip year={year} />}
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={LINE}
                  strokeWidth={2}
                  fill="url(#earningsFill)"
                  dot={false}
                  activeDot={{ r: 5, fill: LINE, stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {!isFetching && total === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="rounded-lg bg-white/90 px-4 py-2 text-sm text-gray-500">
                  No earnings recorded in {year}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Barchart;
