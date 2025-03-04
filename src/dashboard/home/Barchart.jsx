import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select } from 'antd';
import { useChatEarningQuery } from '../../redux/features/earning/monthlyEarning';
 

const data = [
  { month: 'Jan', pv: 2400, amt: 2400 },
  { month: 'Feb', pv: 1398, amt: 2210 },
  { month: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { month: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { month: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { month: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { month: 'Jul', uv: 3490, pv: 5300, amt: 2100 },
  { month: 'Aug', uv: 3490, pv: 8300, amt: 2100 },
  { month: 'Sep', uv: 3490, pv: 7300, amt: 2100 },
  { month: 'Oct', uv: 3490, pv: 4300, amt: 2100 },
  { month: 'Nov', uv: 3490, pv: 9300, amt: 2100 },  // Fixed "Nev" to "Nov"
  { month: 'Dec', uv: 2490, pv: 7300, amt: 2100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
        <p className="label font-medium">{`${label} : ${payload[0].value}`}</p>
        <p className="desc text-sm text-gray-600">Additional details can be shown here.</p>
      </div>
    );
  }

  return null;
};



const Barchart = () => {

const [year, setYear] = useState('2025')

console.log(year);

const {data: earnings} = useChatEarningQuery(year)

console.log(earnings)

const handleChange = (value) => {
  console.log(`selected ${value}`);
  setYear(value)
};

  return (
    <div>
      <div className="flex justify-between items-center pt-2 ">
      <h1 className="font-medium text-header">Earning</h1>
        <Select
          defaultValue="2025"
          className="border-none"
          style={{
            width: 120,
            border: 'none',
          }}
          onChange={handleChange}
          options={[
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
            { value: '2026', label: '2026' },
            { value: '2027', label: '2027' },
            { value: '2028', label: '2028' },
            { value: '2029', label: '2029' },
            { value: '2030', label: '2030' },
          ]}
        />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={earnings?.data?.attributes}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="" />
          <XAxis dataKey="month" /> {/* Fixed dataKey to 'month' */}
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalEarnings" barSize={30} fill="#2E7D32" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;
