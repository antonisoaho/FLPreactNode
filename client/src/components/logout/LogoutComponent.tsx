// LogoutComponent.jsx
import React, { useEffect, useState } from 'react';
import { Logout } from '../../axios/AxiosInstance';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { snackbarState, userState } from '../../recoil/RecoilAtoms';

const LogoutComponent = () => {
  const navigate = useNavigate();
  const setLoginState = useSetRecoilState(userState);
  const setSnackbarState = useSetRecoilState(snackbarState);

  useEffect(() => {
    setLoginState({ loggedIn: false, isAdmin: false, userId: '' });

    setSnackbarState({
      open: true,
      message: 'Utloggning lyckades.',
      severity: 'info',
    });
    Logout();
    setTimeout(() => {
      navigate('/');
    }, 1200);
  }, []);

  return <Container></Container>;
};

export default LogoutComponent;
