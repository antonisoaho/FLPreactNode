import CustomerDashboard from './dashboard/CustomerDashboard';
import CustomerSidebar from '../sidebar/CustomerSidebar';

const CustomerView = () => {
  return (
    <>
      <CustomerSidebar />
      <CustomerDashboard />
    </>
  );
};

export default CustomerView;
