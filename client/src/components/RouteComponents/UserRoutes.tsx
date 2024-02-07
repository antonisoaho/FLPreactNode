import UserComponent from '../users/UserComponents';
import LogoutComponent from '../logout/LogoutComponent';
import { Route } from 'react-router-dom';
// import AccountComponent from '../account/AccountComponent';

const UserRoutes = [
  <Route key="users" path="/users" element={<UserComponent />} />,
  <Route key="logout" path="/logout" element={<LogoutComponent />} />,
  // <Route key="myaccount" path="/account" element={<AccountComponent />} />,
];

export default UserRoutes;
