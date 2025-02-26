import React from 'react';
import Card from './Card';
import Barchart from './Barchart';
import ResentUser from './ResentUsers';
import ResentLandloard from './ResentLandloard';
 
 
 

const DashboardHome = () => {
 
    return (
        <div>
            <Card> </Card>
            <Barchart />
            <ResentUser />
            {/* <ResentLandloard /> */}
        </div>
    );
};

export default DashboardHome;