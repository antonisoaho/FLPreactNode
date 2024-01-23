import {
  Button,
  CardActions,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import CustomerDetailsForm from './forms/CustomerDetailsForm';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { CustomerDetails } from './forms/models/CustomerFormModels';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { snackbarState } from '../../../../recoil/RecoilAtoms';
import { createNewCustomer } from '../../../../apiCalls/apiCustomerCalls';

const CreateCustomer = () => {
  const setSnackbarState = useSetRecoilState(snackbarState);
  const [persons, setPersons] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CustomerDetails[]>([
    { name: '', yearMonth: '', status: '' },
  ]);

  const navigate = useNavigate();

  const handlePersonsChange = (increment: string) => {
    const numberOfPersons = increment === 'add' ? persons + 1 : persons - 1;
    if (numberOfPersons > 0) {
      setPersons(numberOfPersons);

      setFormData((prevData) => {
        const newData = Array.from({ length: numberOfPersons }, (_, index) => ({
          name: index < prevData.length ? prevData[index].name : '',
          yearMonth: index < prevData.length ? prevData[index].yearMonth : '',
          status: index < prevData.length ? prevData[index].status : '',
        }));
        return newData;
      });
    }
  };

  const handleFormChange = (index: number, fieldName: string, value: string) => {
    setFormData((prevData) =>
      prevData.map((formData, i) => (i === index ? { ...formData, [fieldName]: value } : formData))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const response = await createNewCustomer(formData);

    if (response.success) {
      const newCustomerId = response.data?.custId;
      setSnackbarState({
        open: true,
        message: 'Ny kund skapad!',
        severity: 'success',
      });

      navigate(`/customers/${newCustomerId}/edit`);
    } else {
      setSnackbarState({
        open: true,
        message: response.error!,
        severity: 'error',
      });
    }
  };

  return (
    <Grid container alignItems="center" justifyContent="center" direction="column" paddingTop={4}>
      <Grid item>
        <Paper
          sx={{
            paddingX: 8,
            paddingY: 5,
            position: 'relative',
          }}>
          <CardActions
            sx={{
              top: 2,
              right: 2,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Tooltip title="Lägg till person">
              <IconButton onClick={() => handlePersonsChange('add')}>
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            {!(persons < 2) && (
              <Tooltip title="Ta bort person">
                <IconButton onClick={() => handlePersonsChange('remove')}>
                  <PersonRemoveIcon />
                </IconButton>
              </Tooltip>
            )}
          </CardActions>
          <form onSubmit={handleSubmit}>
            <Grid container direction="row" spacing={3} gap={4} marginBottom={4}>
              {formData.map((data, index) => (
                <CustomerDetailsForm
                  formData={data}
                  onChange={(fieldName, value) => handleFormChange(index, fieldName, value)}
                />
              ))}
            </Grid>

            <Button type="submit">
              {loading ? <CircularProgress /> : 'Skapa dokument för kund'}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateCustomer;
