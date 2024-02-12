import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { ExpensesChange } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormNumberFieldProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
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
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const ExpenseChangeForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 6;
  const sendToServer = useSubmitCustomerForm(formFields);

  const details: ExpensesChange = {
    values: {
      changeType: '',
      when: undefined,
      ongoing: undefined,
      value: undefined,
      comment: '',
    },
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
    item: ExpensesChange[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const expenseTypeSelect = [
    'Bostad',
    'Bil',
    'Rörliga hushållskostnader',
    'Lånekostnader',
    'Specialister',
    'Nöjen',
    'Sommarhus mm.',
    'Övrigt',
    'Målsparande',
    'Kartlaggd/Planerad utgift',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {fields.length > 0 &&
            fields.map((detail, index) => (
              <Fragment key={detail.id}>
                <TableRow>
                  <TableCell width="15%">
                    <TextField
                      {...FormSelectProps}
                      required
                      label="Utgiftstyp"
                      {...register(`item.${index}.values.changeType`, {
                        required: 'Vänligen fyll i typ av utgift',
                      })}>
                      {expenseTypeSelect.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      required
                      {...FormNumberFieldProps}
                      {...register(`item.${index}.values.when`, {
                        min: 0,
                        max: 100,
                      })}
                      label="Om hur många år?"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      required
                      {...FormNumberFieldProps}
                      {...register(`item.${index}.values.ongoing`, {
                        min: 0,
                        max: 100,
                      })}
                      label="Hur länge?"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      required
                      {...FormNumberFieldProps}
                      {...register(`item.${index}.values.value`)}
                      label="Belopp"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      {...FormTextFieldProps}
                      {...register(`item.${index}.values.comment`)}
                      label="Kommentar"
                    />
                  </TableCell>
                  <TableCell width="10%" align="right">
                    <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
                  </TableCell>
                </TableRow>
              </Fragment>
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

export default ExpenseChangeForm;
