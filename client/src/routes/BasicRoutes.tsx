import { Route } from 'react-router-dom';
import HomeComponent from '../components/home/HomeComponent';
import LoginComponent from '../components/login/LoginComponent';

const BasicRoutes = [
  <Route key="home" path="/" element={<HomeComponent />} />,
  <Route key="login" path="/login" element={<LoginComponent />} />,
];

export default BasicRoutes;
