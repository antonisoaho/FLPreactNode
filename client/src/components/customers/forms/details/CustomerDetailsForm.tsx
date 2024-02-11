import React from 'react';
import { CustomerDetails } from '../../models/CustomerFormModels';
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
import { formatDateYearMonth } from '../../../../utils/formatting';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const CustomerDetailsForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);

  const details: CustomerDetails = {
    name: '',
    status: '',
    yearMonth: '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      item: [details],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item',
  });

  const onSubmit: SubmitHandler<{
    item: CustomerDetails[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
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
    const newDate = formatDateYearMonth(date);
    setValue(`item.${index}.yearMonth`, newDate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {fields.map((detail, index) => (
            <TableRow key={detail.id}>
              <TableCell sx={{ width: '20%' }}>
                <TextField
                  required
                  label="Namn"
                  {...register(`item.${index}.name`, {
                    required: 'Vänligen ange ett namn.',
                  })}
                  {...FormTextFieldProps}
                  className="form-input-field"
                />
              </TableCell>
              <TableCell sx={{ width: '20%' }}>
                <TextField
                  select
                  className="form-input-select"
                  {...FormTextFieldProps}
                  {...register(`item.${index}.status`)}
                  defaultValue=""
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
                  {...register(`item.${index}.yearMonth`, {
                    required: 'Var vänlig välj ett datum.',
                  })}
                  onChange={(date) => handleDateChange(date as Date, index)}
                  slotProps={{ textField: { ...FormTextFieldProps } }}
                />
              </TableCell>
              <TableCell align="right">
                <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell>
              <Button disabled={isSubmitting} onClick={() => append(details)}>
                Lägg till
              </Button>
            </TableCell>
            <TableCell colSpan={colSpan - 2} align="right">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {!isSubmitting ? 'Spara' : 'Sparar...'}
              </Button>
            </TableCell>
            <TableCell>
              <Button disabled={isSubmitting} onClick={() => setFormOpen(false)}>
                Avbryt
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </form>
  );
};

export default CustomerDetailsForm;
