import React, { useState } from 'react';
import { CustomerChildren } from '../../models/CustomerFormModels';
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
import { formatDate } from '../../../../utils/formatting';
import { useParams } from 'react-router-dom';
import { CustomFormProps, FormFields, FormTextFieldProps } from '../../models/FormProps';
import { getCustomerNames } from '../../../../services/api/apiCustomerCalls';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { useSubmitCustomerForm } from '../../../../hooks/useSubmitCustomerForm';

const CustomerChildForm: React.FC<CustomFormProps> = ({ setFormOpen }) => {
  const { custId } = useParams();
  const colSpan: number = 6;
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensamt', label: 'Gemensamt' },
  ]);

  const formFields: FormFields = {
    field: 'customerChildren',
    custId: custId as string,
  };
  const sendToServer = useSubmitCustomerForm(formFields);

  const details: CustomerChildren = {
    name: '',
    yearMonth: '',
    belongs: '',
    childSupportCounts: true,
    livesAtHomeToAge: 20,
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

  useQuery({
    queryKey: ['customerDetails', custId],
    queryFn: () => getCustomerNames(formFields.custId),

    onSuccess: (data) => {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newItems = data
          .filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newItems];
      });
    },
    onError: () => {
      enqueueSnackbar('Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.', {
        variant: 'error',
      });
    },
  });

  const onSubmit: SubmitHandler<{
    item: CustomerChildren[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const handleDateChange = (date: Date, index: number) => {
    const newDate = formatDate(date);
    setValue(`item.${index}.yearMonth`, newDate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {fields.map((detail, index) => (
            <TableRow key={index}>
              <TableCell width="18%">
                <TextField
                  required
                  label="Namn"
                  defaultValue={detail.name}
                  {...register(`item.${index}.name`, { required: 'Vänligen ange ett namn.' })}
                  {...FormTextFieldProps}
                  className="form-input-field"
                />
              </TableCell>
              <TableCell width="18%">
                <TextField
                  required
                  {...FormTextFieldProps}
                  className="form-input-select"
                  defaultValue={detail.belongs}
                  select
                  fullWidth
                  label="Tillhör"
                  {...register(`item.${index}.belongs`, {
                    required: 'Vänligen välj ett alternativ.',
                  })}>
                  {selectItems.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell width="18%">
                <InputLabel shrink className="form-checkbox-label">
                  Barnbidrag räknas
                </InputLabel>
                <Checkbox {...register(`item.${index}.childSupportCounts`)} />
              </TableCell>
              <TableCell width="18%">
                <DatePicker
                  required
                  className="form-input-field"
                  slotProps={{ textField: { ...FormTextFieldProps } }}
                  label="Född *"
                  views={['month', 'year']}
                  {...register(`item.${index}.yearMonth`, {
                    required: 'Var vänlig välj ett datum.',
                  })}
                  onChange={(date) => handleDateChange(date as Date, index)}
                />
              </TableCell>
              <TableCell width="18%">
                <TextField
                  required
                  className="form-input-field"
                  type="number"
                  defaultValue={detail.livesAtHomeToAge}
                  {...register(`item.${index}.livesAtHomeToAge`)}
                  label="Bor hemma till"
                  {...FormTextFieldProps}
                  sx={{ maxWidth: '7rem' }}
                />
              </TableCell>
              <TableCell width="10%" align="right">
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

export default CustomerChildForm;
