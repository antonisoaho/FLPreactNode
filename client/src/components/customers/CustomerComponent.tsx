import {
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import CustomerModel from './models/CustomerModel';
import { useRecoilValue } from 'recoil';
import { userState } from '../../services/state/RecoilAtoms';
import { getUserList } from '../../services/api/apiUserCalls';
import UserModel from '../users/models/UserModel';
import { createNewCustomer, getCustomerList } from '../../services/api/apiCustomerCalls';
import CustomerCard from './cards/CustomerCard';
import AddButton from '../ui/button/AddButton';
import { useNavigate } from 'react-router-dom';
import PromptDialog from '../ui/promtDialog/PromptDialog';
import { enqueueSnackbar } from 'notistack';

const CustomerComponent = () => {
  const [customers, setCustomers] = useState<Array<CustomerModel>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(-1);
  const [advisorList, setAdvisorList] = useState<UserModel[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('updatedAt');
  const [openDialog, setOpenDialog] = useState(false);
  const { isAdmin } = useRecoilValue(userState);
  const navigate = useNavigate();

  const populateAdvisors = async () => {
    const response = await getUserList();

    if (response.success && response.status === 200) {
      setAdvisorList(response.data!);
      setLoading(false);
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }
  };

  const getCustomers = async () => {
    const response = await getCustomerList();

    if (response.success && response.status === 200) {
      setCustomers(response.data!);
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }
  };

  const handleAdvisor = (event: SelectChangeEvent<string | number>) => {
    const selectedValue = event.target.value;
    setSelectedAdvisor(selectedValue);
  };

  const filterCustomersByName = (customer: CustomerModel) => {
    if (!customer.customerNames) {
      return true;
    }
    if (searchTerm) {
      return customer.customerNames.some((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return true;
    }
  };

  const handleSortOption = (event: SelectChangeEvent<string>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const sortCustomers = (a: CustomerModel, b: CustomerModel) => {
    if (!a.customerNames[0] || !b.customerNames[0]) {
      return 0;
    }

    if (sortOption === 'name') {
      return a.customerNames[0].localeCompare(b.customerNames[0]);
    } else if (sortOption === 'updatedAt') {
      return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
    }

    return 0;
  };

  const handleAddCustomer = async () => {
    setLoading(true);
    const response = await createNewCustomer();

    if (response.success) {
      const newCustomerId = response.data?.custId;
      enqueueSnackbar('Kund skapad', {
        variant: 'success',
      });

      navigate(`/customers/${newCustomerId}`);
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    populateAdvisors();
    getCustomers();
    setLoading(false);
  }, []);

  return (
    <Container>
      {!loading ? (
        <>
          <AddButton
            onClick={() => setOpenDialog(true)}
            isLink={false}
            textInput={'Skapa ny kund'}
          />
          <PromptDialog
            confirm={handleAddCustomer}
            canceled={() => setOpenDialog(false)}
            dialogOpen={openDialog}
            title={'Skapa ny kund?'}
            prompt={'Vill du fortsätta med att skapa upp ett nytt kunddokument?'}
            color={'primary'}
          />
          <Grid container direction="row" spacing={2} alignItems="end" justifyContent="center">
            {isAdmin && (
              <Grid item alignItems="center">
                <FormControl variant="outlined">
                  <InputLabel id="advisorIds-label">Rådgivare</InputLabel>
                  <Select
                    sx={{ minWidth: '180px', textAlign: 'left' }}
                    label="Rådgivare"
                    labelId="advisorIds"
                    id="selectedAdvisor"
                    value={selectedAdvisor}
                    onChange={(event) => {
                      handleAdvisor(event);
                    }}>
                    <MenuItem value={-1} key={'allAdvisors'}>
                      Alla
                    </MenuItem>
                    {advisorList?.map((advisor, index) => (
                      <MenuItem value={index} key={advisor._id}>
                        {advisor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item sx={{ marginRight: 'auto' }}>
              <FormControl variant="outlined">
                <InputLabel id="sort">Sortera enligt</InputLabel>
                <Select
                  sx={{ minWidth: '180px', textAlign: 'left' }}
                  label="sortera enligt"
                  labelId="sort"
                  value={sortOption}
                  onChange={(event) => {
                    handleSortOption(event);
                  }}>
                  <MenuItem value="name">Namn</MenuItem>
                  <MenuItem value="updatedAt">Senast uppdaterad</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <TextField
                label="Sök kundnamn"
                variant="outlined"
                value={searchTerm}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setSearchTerm(e.target.value as string)
                }
              />
            </Grid>
          </Grid>
          <Grid justifyContent="center" container spacing={2} marginTop={1}>
            {customers
              .filter(
                (cust) =>
                  advisorList &&
                  (selectedAdvisor === -1 || cust.advisorId === advisorList[selectedAdvisor]._id)
              )
              .sort(sortCustomers)
              .filter(filterCustomersByName)
              .map((cust) => (
                <Grid item sx={{ maxWidth: 275 }} key={cust.custId}>
                  <CustomerCard cust={cust} />
                </Grid>
              ))}
          </Grid>
        </>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default CustomerComponent;
