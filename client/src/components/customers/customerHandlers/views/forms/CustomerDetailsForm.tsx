import React from 'react';
import { CustomerDetails } from './models/CustomerFormModels';
import {
  Button,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatDate } from './models/commonFunctions';
import { useForm, SubmitHandler, FormProvider, useFormState } from 'react-hook-form';
import SelectWithLabelHook from '../../../../../commonComponents/selectWithLabel/SelectWithLabelHook';
import { updateCustomer } from '../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';

interface CustomerDetailsFormProps {
  closeForm?: () => void;
  submitted?: () => void;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ closeForm, submitted }) => {
  const methods = useForm();
  const { register, handleSubmit, setValue } = useForm<CustomerDetails>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const { isSubmitting } = useFormState();
  const { custId } = useParams();

  const onSubmit: SubmitHandler<CustomerDetails> = async (data) => {
    setIsSubmitting(true);

    console.log('data', data);
    const response = await updateCustomer({
      field: 'customerDetails',
      _id: custId as string,
      formData: data,
    });

    if (response.success) {
      console.log('response.data', response.data);

      setIsSubmitting(false);
      if (closeForm) closeForm();
      if (submitted) submitted();
    }
  };

  const selectItems = [
    {
      value: 'Gift',
      label: 'Gift',
    },
    {
      value: 'Sambo',
      label: 'Sambo',
    },
    {
      value: 'Särbo',
      label: 'Särbo',
    },
    {
      value: 'Singel',
      label: 'Singel',
    },
  ];

  const handleDateChange = (date: Date) => {
    const newDate = formatDate(date);
    setValue('yearMonth', newDate);
  };

  const inputProps = {
    sx: { m: 0, width: '100%' },
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField label="Namn" {...register('name', { required: true })} {...inputProps} />
              </TableCell>
              <TableCell>
                <SelectWithLabelHook
                  name={'status'}
                  items={selectItems}
                  selectLabel={'Relationsstatus'}
                />
              </TableCell>
              <TableCell>
                <DatePicker
                  label="Födelsedatum"
                  views={['month', 'year']}
                  {...register('yearMonth', { required: true })}
                  onChange={(date) => handleDateChange(date as Date)}
                  {...inputProps}
                />
              </TableCell>
              <TableCell align="right">
                <Button type="submit" disabled={isSubmitting}>
                  {!isSubmitting ? 'Spara' : 'Sparar...'}
                </Button>
              </TableCell>
              <TableCell>
                <ListItemButton>Ångra</ListItemButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </FormProvider>
  );
};

export default CustomerDetailsForm;
