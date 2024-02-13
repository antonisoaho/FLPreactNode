import React from 'react';
import { IncomeChange } from '../../models/CustomerFormModels';
import { CustomFormProps, FormNumberFieldProps, FormSelectProps } from '../../models/FormProps';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  MenuItem,
  TextField,
  ListItemButton,
} from '@mui/material';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

const IncomeChangeForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: IncomeChange = {
    belongs: '',

    changeType: '',
    when: undefined,
    newAmount: undefined,
  };

  const changeValueSelect = [
    {
      value: 'Ink. Av tjänst',
      label: 'Ink. Av tjänst',
    },
    {
      value: 'NE Inkomst',
      label: 'NE Inkomst',
    },
    {
      value: 'K10',
      label: 'K10',
    },
    {
      value: 'Skattefritt',
      label: 'Skattefritt',
    },
  ];

  const {
    register,
    handleSubmit,
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
    item: IncomeChange[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  if (isLoading)
    return (
      <Table>
        <TableBody>
          <TableLoader colSpan={colSpan} />
        </TableBody>
      </Table>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {fields.map((detail, index) => (
            <TableRow key={detail.id}>
              <TableCell width="20%">
                <TextField
                  {...FormSelectProps}
                  required
                  label="Tillhör"
                  {...register(`item.${index}.belongs`, {
                    required: 'Vänligen välj vem inkomsten tillhör',
                  })}>
                  {selectItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell width="20%">
                <TextField
                  {...FormSelectProps}
                  required
                  label="Typ av ändring"
                  {...register(`item.${index}.changeType`, {
                    required: 'Vänligen välj typ av ändring.',
                  })}>
                  {changeValueSelect.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell width="20%">
                <TextField
                  required
                  {...FormNumberFieldProps}
                  label="Om hur många år"
                  {...register(`item.${index}.when`, { min: 0 })}
                />
              </TableCell>
              <TableCell width="20%">
                <TextField
                  required
                  {...FormNumberFieldProps}
                  label="Nytt belopp"
                  {...register(`item.${index}.newAmount`)}
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

export default IncomeChangeForm;
