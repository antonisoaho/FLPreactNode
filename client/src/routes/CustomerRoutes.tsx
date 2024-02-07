import { Route } from 'react-router-dom';
import CustomerComponent from '../components/customers/CustomerComponent';
import CustomerPrintversion from '../components/customers/print/CustomerPrintversion';
import CustomerView from '../components/customers/CustomerView';

const CustomerRoutes = [
  <Route key="customers" path="/customers" element={<CustomerComponent />} />,
  <Route key="view" path="/customers/:custId" element={<CustomerView />} />,
  <Route key="print" path="/customers/:custId/print" element={<CustomerPrintversion />} />,
];

export default CustomerRoutes;
