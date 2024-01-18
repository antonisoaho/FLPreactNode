// SnackbarComponent.js
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { snackbarState } from '../../recoil/RecoilAtoms';

const SnackbarComponent = () => {
  const snackbar = useRecoilValue(snackbarState);
  const setSnackbarState = useSetRecoilState(snackbarState);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState((prevSnackbarState) => ({
      ...prevSnackbarState,
      open: false,
    }));
  };

  return (
    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleClose}>
      <Alert severity={snackbar.severity as AlertColor} onClose={handleClose}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
