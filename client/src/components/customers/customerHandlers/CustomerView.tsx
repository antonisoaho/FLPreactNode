import React from 'react';
import CustomerDashboard from './dashboard/CustomerDashboard';
import CustomerSidebar from './CustomerSidebar';

const CustomerView = () => {
  return (
    <>
      <CustomerSidebar />
      <CustomerDashboard />
    </>
  );
};

export default CustomerView;
