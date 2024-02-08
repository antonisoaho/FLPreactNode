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
import { useQuery } from 'react-query';

dayjs.locale('sv');

const App = () => {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;
  const setUser = useSetRecoilState(userState);

  const { isLoading } = useQuery({
    queryFn: userInfoGetMe,
    queryKey: ['loggedInUser'],

    onSuccess: (data) => {
      setUser({
        loggedIn: true,
        isAdmin: data.isAdmin,
        userId: data.userId,
      });
    },
    onError: () => {
      Logout();
      localStorage.removeItem('TOKEN');
    },
  });

  return (
    <div className="App" style={{ display: 'grid' }}>
      {isLoading ? (
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
