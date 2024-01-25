import { Route } from 'react-router-dom';
import CustomerComponent from '../customers/CustomerComponent';
import CustomerPrintversion from '../customers/customerHandlers/print/CustomerPrintversion';
import CustomerView from '../customers/customerHandlers/CustomerView';

const CustomerRoutes = [
  <Route key="customers" path="/customers" element={<CustomerComponent />} />,
  <Route key="view" path="/customers/:custId" element={<CustomerView />} />,
  <Route key="print" path="/customers/:custId/print" element={<CustomerPrintversion />} />,
];

export default CustomerRoutes;
