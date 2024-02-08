import { Route } from 'react-router-dom';
import HomeComponent from '../components/home';
import LoginComponent from '../components/login';

const BasicRoutes = [
  <Route key="home" path="/" element={<HomeComponent />} />,
  <Route key="login" path="/login" element={<LoginComponent />} />,
];

export default BasicRoutes;
