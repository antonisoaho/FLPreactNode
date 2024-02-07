import { Route } from 'react-router-dom';
import HomeComponent from '../home/HomeComponent';
import LoginComponent from '../login/LoginComponent';

const BasicRoutes = [
  <Route key="home" path="/" element={<HomeComponent />} />,
  <Route key="login" path="/login" element={<LoginComponent />} />,
];

export default BasicRoutes;
