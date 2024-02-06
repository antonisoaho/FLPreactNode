import CustomerDashboard from './views/dashboard/CustomerDashboard';
import CustomerSidebar from './sidebar/CustomerSidebar';
import CustomerTable from './views/table/CustomerTable';
import { Box, CircularProgress, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getSingleCustomerById } from '../../../apiCalls/apiCustomerCalls';
import { CustomerOverview } from './views/models/ViewCustomerModel';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../../recoil/RecoilAtoms';

const CustomerView = () => {
  const setSnackbarState = useSetRecoilState(snackbarState);
  const [customer, setCustomer] = useState<CustomerOverview>();
  const { custId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);

  const getCustomer = async () => {
    const response = await getSingleCustomerById(custId!);
    if (response.success && response.status === 200) {
      setCustomer(response.data as CustomerOverview);
      setLoading(false);
    } else {
      setSnackbarState({
        open: true,
        message: response.error!,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    getCustomer();
  }, [custId]);

  return (
    <>
      <CustomerSidebar />
      <Box
        sx={{
          maxWidth: 1600,
          minWidth: 800,
          mx: '60px',
          py: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          alignSelf: 'center',
        }}>
        {loading ? (
          <CircularProgress sx={{ alignSelf: 'center' }} />
        ) : (
          <>
            <CustomerDashboard customer={customer!} />
            <Divider />
            <CustomerTable customer={customer!} />
          </>
        )}
      </Box>
    </>
  );
};

export default CustomerView;
