import React, { useEffect, useState } from 'react';
import { CustomerDetails } from '../models/CustomerFormModels';
import {
  Button,
  ListItemButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatDate } from '../models/commonFunctions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateCustomer } from '../../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import { removeFormByIndex } from '../models/commonFunctions';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';

const CustomerDetailsForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CustomerDetails[]>();
  const [details, setDetails] = useState<CustomerDetails[]>([]);
  const { custId } = useParams();

  const onSubmit: SubmitHandler<CustomerDetails[]> = async (data) => {
    const response = await updateCustomer({
      field: 'customerDetails',
      _id: custId as string,
      formData: data,
    });

    if (response.success) {
      if (submitted) {
        submitted();
        setFormCount(0);
      }
    }
  };

  useEffect(() => {
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        name: '',
        status: '',
        yearMonth: '',
      });
    }
    setDetails(newDetails);
  }, [formCount]);

  const removeDetail = (index: number) => {
    if (details.length > 0) {
      setDetails(removeFormByIndex(details, index));
      setFormCount(formCount - 1);
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

  const handleDateChange = (date: Date, index: number) => {
    const newDate = formatDate(date);
    setValue(`${index}.yearMonth`, newDate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell sx={{ width: '20%' }}>
                <TextField
                  required
                  label="Namn"
                  {...register(`${index}.name`, { required: 'Vänligen ange ett namn.' })}
                  {...FormTextFieldProps}
                  className="form-input-field"
                />
              </TableCell>
              <TableCell sx={{ width: '20%' }}>
                <TextField
                  select
                  className="form-input-select"
                  {...FormTextFieldProps}
                  {...register(`${index}.status`)}
                  defaultValue={detail.status}
                  label="Relationsstatus">
                  {selectItems.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell>
                <DatePicker
                  className="form-input-field"
                  label="Födelsedatum"
                  views={['month', 'year']}
                  {...register(`${index}.yearMonth`, { required: 'Var vänlig välj ett datum.' })}
                  onChange={(date) => handleDateChange(date as Date, index)}
                  slotProps={{ textField: { ...FormTextFieldProps } }}
                />
              </TableCell>
              <TableCell align="right">
                <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
              </TableCell>
            </TableRow>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Button type="submit" disabled={isSubmitting}>
                  {!isSubmitting ? 'Spara' : 'Sparar...'}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </form>
  );
};

export default CustomerDetailsForm;
