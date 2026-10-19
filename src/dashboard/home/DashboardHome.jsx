import React from 'react';
import Card from './Card';
import Barchart from './Barchart';
import ResentUser from './ResentUsers';

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <Card />
      <Barchart />
      <ResentUser />
    </div>
  );
};

export default DashboardHome;
