import { CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../../../recoil/RecoilAtoms';
import { CustomerOverview } from '../models/ViewCustomerModel';
import { getSingleCustomerById } from '../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';

const CustomerPrintversion = () => {
  const setSnackbarState = useSetRecoilState(snackbarState);
  const [customer, setCustomer] = useState<CustomerOverview | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const { custId } = useParams();

  const getCustomer = async () => {
    const response = await getSingleCustomerById(custId!);
    if (response.success && response.status === 200) {
      setCustomer(response.data);

      setLoading(false);
    } else {
      setSnackbarState({
        open: true,
        message: response.error!,
        severity: 'error',
      });
    }
  };

  const totalIncome: number =
    customer?.income.base.reduce((sum, inc) => inc.values.serviceIncome + sum, 0) || 0;

  useEffect(() => {
    getCustomer();
  }, []);
  return (
    <>
      {!loading ? (
        <Grid
          direction="column"
          justifyContent="center"
          container
          spacing={3}
          marginTop={1}
          wrap="wrap">
          <Typography variant="h4" sx={{ minWidth: '80%' }}>
            NULÄGE
          </Typography>
          {customer && <Typography>{customer._id}</Typography>}
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default CustomerPrintversion;
