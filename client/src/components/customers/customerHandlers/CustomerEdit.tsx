import { Outlet } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';

const CustomerEdit = () => {
  console.log('CustomerEdit render');

  return (
    <>
      <CustomerSidebar />
      CustomerEdit
      <Outlet />
    </>
  );
};

export default CustomerEdit;
