import { useEffect, useState } from 'react';
import { getSingleCustomerById } from '../../../../apiCalls/apiCustomerCalls';
import { snackbarState } from '../../../../recoil/RecoilAtoms';
import { useSetRecoilState } from 'recoil';
import { Link, useParams } from 'react-router-dom';
import { CustomerOverview } from '../models/ViewCustomerModel';
import { CircularProgress, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import DashboardCard from './card/DashboardCard';
import DashboardDiagrams from './diagrams/DashboardDiagrams';
import PrintIcon from '@mui/icons-material/Print';

const CustomerDashboard = () => {
  const setSnackbarState = useSetRecoilState(snackbarState);
  const [customer, setCustomer] = useState<CustomerOverview>();
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

  const totalExpense: number =
    customer?.expenses.base.reduce((sum, inc) => inc.values.mapped + sum, 0) || 0;

  const numberOfChildren: number = customer?.customerChildren.length || 0;

  const numberOfInsurances: number = customer?.insurances
    ? Object.values(customer.insurances).reduce((totalLength, insuranceArray) => {
        return totalLength + insuranceArray.length;
      }, 0)
    : 0;

  const cardItems = [
    {
      field: 'Inkomst',
      value: totalIncome!.toLocaleString() + 'SEK',
      href: 'income',
    },
    {
      field: 'Utgift',
      value: totalExpense!.toLocaleString() + ' SEK',
      href: 'expenses',
    },
    {
      field: 'Barn',
      value: numberOfChildren,
      href: 'children',
    },
    {
      field: numberOfInsurances > 1 ? 'Försäkringar' : 'Försäkring',
      value: numberOfInsurances,
      href: 'insurances',
    },
  ];

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <Grid
      justifyContent="center"
      container
      spacing={3}
      wrap="wrap"
      maxWidth="90%"
      justifySelf="center">
      <Stack sx={{ position: 'absolute', right: 10, alignItems: 'end' }}>
        <Typography variant="overline">{customer?._id}</Typography>
        <Tooltip title="Gå till sida för utskrift.">
          <IconButton component={Link} to={`/customers/${custId}/print`}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {((customer?.income.base.length ?? 0) && (customer?.expenses.base.length ?? 0)) > 0 && (
            <DashboardDiagrams customer={customer!} />
          )}

          <Grid container justifyContent="center" spacing={3} sx={{ marginTop: 1 }}>
            {cardItems.map((item, idx) => (
              <DashboardCard key={idx} {...item} />
            ))}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CustomerDashboard;
