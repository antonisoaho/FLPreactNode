import { Route } from 'react-router-dom';
import CustomerComponent from '../components/customers';
import CustomerView from '../components/customers/CustomerView';

const CustomerRoutes = [
  <Route key="customers" path="/customers" element={<CustomerComponent />} />,
  <Route key="view" path="/customers/:custId" element={<CustomerView />} />,
];

export default CustomerRoutes;
