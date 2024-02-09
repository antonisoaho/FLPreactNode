// LogoutComponent.jsx
import { useEffect } from 'react';
import { Logout } from '../../services/api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../services/state/RecoilAtoms';
import { enqueueSnackbar } from 'notistack';
import PageLoader from '../ui/pageLoader';

const LogoutComponent = () => {
  const navigate = useNavigate();
  const setLoginState = useSetRecoilState(userState);

  useEffect(() => {
    setLoginState({ loggedIn: false, isAdmin: false, userId: '' });

    enqueueSnackbar('Du är nu utloggad', {
      variant: 'info',
    });

    Logout();

    setTimeout(() => {
      navigate('/');
    }, 1000);
  }, []);

  return <PageLoader />;
};

export default LogoutComponent;
