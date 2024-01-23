import { Route } from 'react-router-dom';
import CustomerComponent from '../customers/CustomerComponent';
import CustomerPrintversion from '../customers/customerHandlers/print/CustomerPrintversion';
import CreateCustomer from '../customers/customerHandlers/edit/CreateCustomer';
import CustomerEdit from '../customers/customerHandlers/edit/CustomerEdit';
import CustomerView from '../customers/customerHandlers/CustomerView';

const CustomerRoutes = [
  <Route key="customers" path="/customers" element={<CustomerComponent />} />,
  <Route key="create" path="/customers/create" element={<CreateCustomer />} />,
  <Route key="view" path="/customers/:custId" element={<CustomerView />} />,
  <Route key="print" path="/customers/:custId/print" element={<CustomerPrintversion />} />,
  <Route key="edit" path="/customers/:custId/edit" element={<CustomerEdit />}>
    {/* <Route path="forms" element={<FormContainer />} /> */}
  </Route>,
];

export default CustomerRoutes;
