import React, { useEffect, useState } from 'react';
import { CustomerChildren } from '../models/CustomerFormModels';
import {
  Button,
  Checkbox,
  InputLabel,
  ListItemButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatDate, removeFormByIndex } from '../models/commonFunctions';
import { useParams } from 'react-router-dom';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { getCustomerNames, updateCustomer } from '../../../../../../apiCalls/apiCustomerCalls';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';

const CustomerChildForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const [details, setDetails] = useState<CustomerChildren[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensamt', label: 'Gemensamt' },
  ]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CustomerChildren[]>();

  const populateSelectItems = async () => {
    const response = await getCustomerNames(custId!);
    if (response.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newItems = response
          .data!.filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newItems];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<CustomerChildren[]> = async (data) => {
    const response = await updateCustomer({
      field: 'customerChildren',
      _id: custId as string,
      formData: data,
    });

    if (response.success) {
      setFormCount(0);
      if (submitted) submitted();
    }
  };

  useEffect(() => {
    populateSelectItems();
  }, [custId]);

  useEffect(() => {
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        name: '',
        yearMonth: '',
        belongs: '',
        childSupportCounts: true,
        livesAtHomeToAge: 20,
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
              <TableCell>
                <TextField
                  required
                  label="Namn"
                  defaultValue={detail.name}
                  {...register(`${index}.name`, { required: 'Vänligen ange ett namn.' })}
                  {...FormTextFieldProps}
                  className="form-input-field"
                />
              </TableCell>
              <TableCell>
                <TextField
                  required
                  {...FormTextFieldProps}
                  className="form-input-select"
                  defaultValue={detail.belongs}
                  select
                  fullWidth
                  label="Tillhör"
                  {...register(`${index}.belongs`, {
                    required: 'Vänligen välj ett alternativ.',
                  })}>
                  {selectItems.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell>
                <InputLabel shrink className="form-checkbox-label">
                  Barnbidrag räknas
                </InputLabel>
                <Checkbox {...register(`${index}.childSupportCounts`)} />
              </TableCell>
              <TableCell>
                <DatePicker
                  required
                  className="form-input-field"
                  slotProps={{ textField: { ...FormTextFieldProps } }}
                  label="Född *"
                  views={['month', 'year']}
                  {...register(`${index}.yearMonth`, { required: 'Var vänlig välj ett datum.' })}
                  onChange={(date) => handleDateChange(date as Date, index)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  required
                  className="form-input-field"
                  type="number"
                  defaultValue={detail.livesAtHomeToAge}
                  {...register(`${index}.livesAtHomeToAge`)}
                  label="Bor hemma till"
                  {...FormTextFieldProps}
                  sx={{ maxWidth: '7rem' }}
                />
              </TableCell>
              <TableCell align="right">
                <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
              </TableCell>
            </TableRow>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={6} align="right">
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

export default CustomerChildForm;
