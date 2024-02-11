import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { ExpensesBase } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
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
import { useGetCustomerNames } from '../../../../hooks/customer/useGetCustomerNames';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const ExpenseBaseForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 5;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { persons, isLoading } = useGetCustomerNames(formFields.custId);

  const details: ExpensesBase = {
    values: {
      expenseType: '',
      mapped: 0,
      pension: [],
      activeEnd: [],
      difPension: [],
      difActiveEnd: [],
      difDeath: [],
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
    item: ExpensesBase[];
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
          {persons?.length &&
            fields.map((detail, index) => (
              <Fragment key={index}>
                <TableRow>
                  <TableCell width="20%">
                    <TextField
                      className="form-input-select"
                      {...FormTextFieldProps}
                      select
                      required
                      defaultValue={detail.values!.expenseType}
                      label="Utgiftstyp"
                      {...register(`item.${index}.values.expenseType`, {
                        required: 'Vänligen fyll i typ av utgift',
                      })}>
                      {expenseTypeSelect.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell width="20%">
                    <TextField
                      className="form-input-field"
                      {...FormTextFieldProps}
                      required
                      type="number"
                      label="Kartlaggt belopp"
                      placeholder="Ange belopp"
                      {...register(`item.${index}.values.mapped`, {
                        required: 'Vänligen fyll i kartlaggt belopp',
                      })}
                    />
                  </TableCell>
                  <TableCell width="20%" />
                  <TableCell width="20%" />
                  <TableCell width="10%" align="right">
                    <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
                  </TableCell>
                </TableRow>
                {persons.map((person, idx) => (
                  <TableRow key={person}>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        required
                        type="number"
                        defaultValue={detail.values!.pension![idx]}
                        label={`Pensionsålder ${person.split(' ')[0]}`}
                        placeholder="Ange belopp"
                        {...register(`item.${index}.values.pension.${idx}`, {
                          required: 'Vänligen fyll i pensionsålder',
                        })}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        defaultValue={detail.values!.activeEnd![idx]}
                        label={`Aktiv tid slut ${person.split(' ')[0]}`}
                        placeholder="Ange belopp"
                        {...register(`item.${index}.values.activeEnd.${idx}`, {
                          required: 'Vänligen fyll i ålder för aktiv tid slut',
                        })}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        label={`Dif ${person.split(' ')[0]} pension`}
                        placeholder="Ange belopp"
                        {...register(`item.${index}.values.difPension.${idx}`)}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        label={`Dif ${person.split(' ')[0]} aktivt slut`}
                        placeholder="Ange belopp"
                        {...register(`item.${index}.values.difActiveEnd.${idx}`)}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        label={`Dif ${person.split(' ')[0]} död`}
                        placeholder="Ange belopp"
                        {...register(`item.${index}.values.difDeath.${idx}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
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

export default ExpenseBaseForm;
