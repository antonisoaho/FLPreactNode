import { useEffect, useState } from 'react';
import './assets/App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import globalRouter from './services/providers/globalRouter';
import ResponsiveAppBar from './components/navbar/NavbarComponent';
import { Logout } from './services/api/AxiosInstance';
import { CircularProgress } from '@mui/material';
import { useSetRecoilState } from 'recoil';
import { userState } from './services/state/RecoilAtoms';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import ProtectedRoute from './routes/ProtectedRoute';
import CustomerRoutes from './routes/CustomerRoutes';
import UserRoutes from './routes/UserRoutes';
import BasicRoutes from './routes/BasicRoutes';
import PageNotFound from './routes/PageNotFound';
import { userInfoGetMe } from './services/api/apiUserCalls';

dayjs.locale('sv');

const App = () => {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;
  const [loading, setLoading] = useState<boolean>(true);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const checkUserLogin = async () => {
      if (localStorage.getItem('TOKEN')) {
        try {
          const userRoleData = await userInfoGetMe();

          if (userRoleData.success) {
            setUser({
              loggedIn: true,
              isAdmin: userRoleData.data!.isAdmin,
              userId: userRoleData.data!.userId,
            });
          } else {
            Logout();
          }
        } catch (error) {
          Logout();
        }
      }
      setLoading(false);
    };

    checkUserLogin();
  }, []);

  return (
    <div className="App" style={{ display: 'grid' }}>
      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <>
          <ResponsiveAppBar />
          <>
            <Routes>
              {/* Home and Login */}
              {BasicRoutes}

              {/* Protected routes nested */}
              <Route element={<ProtectedRoute />}>
                {/* Logout, users and myaccount */}
                {UserRoutes}

                {/* Customer related pages */}
                {CustomerRoutes}
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </>
        </>
      )}
    </div>
  );
};

export default App;
