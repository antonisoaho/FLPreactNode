import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../services/state/RecoilAtoms';

export const ProtectedRoute = () => {
  const location = useLocation();

  const { loggedIn } = useRecoilValue(userState);

  return loggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;
