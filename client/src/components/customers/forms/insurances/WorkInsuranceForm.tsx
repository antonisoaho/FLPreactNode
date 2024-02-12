import {
  Table,
  TableBody,
  TableCell,
  TextField,
  MenuItem,
  ListItemButton,
  TableRow,
  Button,
} from '@mui/material';
import React from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { InsuranceWork } from '../../models/CustomerFormModels';
import { CustomFormProps, FormSelectProps } from '../../models/FormProps';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const WorkInsuranceForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: InsuranceWork = {
    belongs: '',
    insuranceType: '',
  };

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
    item: InsuranceWork[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const insuranceType = [
    {
      value: 'Saknas',
      label: 'Företagare - Saknas',
    },
    {
      value: 'TFA',
      label: 'Företagare- TFA',
    },
    {
      value: 'TGL',
      label: 'Företagare - TGL',
    },
    {
      value: 'AGS',
      label: 'Företagare - AGS',
    },
    {
      value: 'ITP1',
      label: 'Anställd - ITP-1',
    },
    {
      value: 'ITP-2',
      label: 'Anställd - ITP-2',
    },
    {
      value: '10',
      label: 'Anställd - 10´´',
    },
    {
      value: 'kollektiv',
      label: 'Anställd - Kollektivanst.',
    },
    {
      value: 'landsting',
      label: 'Anställd - Kommun/Landsting',
    },
    {
      value: 'statlig',
      label: 'Anställd - Statlig',
    },
  ];

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
          {!selectItems.length ? (
            <TableLoader colSpan={colSpan} />
          ) : (
            fields.map((detail, index) => (
              <TableRow key={detail.id}>
                <TableCell width="40%">
                  <TextField
                    required
                    {...FormSelectProps}
                    label="Försäkrad"
                    {...register(`item.${index}.belongs`, {
                      required: 'Vänligen välj vem försäkringen gäller.',
                    })}>
                    {selectItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="40%">
                  <TextField
                    required
                    {...FormSelectProps}
                    label="Försäkringstyp"
                    {...register(`item.${index}.insuranceType`, {
                      required: 'Vänligen välj vem försäkringen gäller.',
                    })}>
                    {insuranceType.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell>
                  <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
                </TableCell>
              </TableRow>
            ))
          )}
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

export default WorkInsuranceForm;
