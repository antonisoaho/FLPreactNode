import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('TOKEN');
  const location = useLocation();

  return token !== undefined ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;
