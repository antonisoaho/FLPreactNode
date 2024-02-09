import CustomerDashboard from './dashboard/CustomerDashboard';
import CustomerSidebar from './sidebar/CustomerSidebar';
import CustomerTable from './table/CustomerTable';
import { Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getSingleCustomerById } from '../../services/api/apiCustomerCalls';
import { enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import PageLoader from '../ui/pageLoader';

const CustomerView = () => {
  const { custId } = useParams();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', custId],
    queryFn: () => getSingleCustomerById(custId!),
    cacheTime: 0,
    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  if (isLoading) {
    return <PageLoader />;
  }

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
        <CustomerDashboard customer={customer!} />
        <Divider />
        <CustomerTable customer={customer!} />
      </Box>
    </>
  );
};

export default CustomerView;
