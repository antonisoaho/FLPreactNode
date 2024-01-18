import React, { useState, useEffect } from 'react';
import axiosInstance, { ExtendedError } from '../../axios/AxiosInstance';
import { Container, Box } from '@mui/material';
import AccountModel from './models/AccountModel';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../recoil/RecoilAtoms';
import { userInfoGetMe } from '../../apiCalls/apiUserCalls';

const AccountComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [account, setAccount] = useState<AccountModel | undefined>(undefined);
  const setSnackbarState = useSetRecoilState(snackbarState);

  useEffect(() => {
    const getMyAccount = async () => {
      setLoading(true);
      try {
        const response = await userInfoGetMe();

        if (response.status === 200) setAccount(response.data);
        setLoading(false);
      } catch (error) {
        const extendedError = error as ExtendedError;
        if (extendedError.showSnackbar) {
          setSnackbarState({
            open: true,
            message: extendedError.snackbarMessage || 'Ett fel inträffade',
            severity: 'error',
          });
        } else {
          console.error('Other error:', error);
        }
      }
    };
    getMyAccount();
  }, []);

  const changePassword = () => {
    // Lägg in en childComponent
  };

  return (
    <Container>
      <Box>My Accountpage</Box>
    </Container>
  );
};

export default AccountComponent;
