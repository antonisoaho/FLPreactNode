import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getCustomerNames, updateCustomer } from '../../../../services/api/apiCustomerCalls';
import { snackbarState } from '../../../../services/state/RecoilAtoms';
import { ExpensesBase } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { removeFormByIndex } from '../../../../utils/commonFunctions';
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

const ExpenseBaseForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ExpensesBase[]>();
  const [details, setDetails] = useState<ExpensesBase[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [persons, setPersons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const populateSelectItems = async () => {
    const response = await getCustomerNames(custId!);
    if (response.success) {
      setPersons((prev) => {
        const currentNames = prev.map((item) => item);
        const newNames = response
          .data!.filter((name: any) => !currentNames.includes(name.split(' ')[0]))
          .map((name: string) => name.split(' ')[0]);

        setLoading(false);
        return [...prev, ...newNames];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<ExpensesBase[]> = async (data) => {
    const response = await updateCustomer({
      field: 'expenses',
      _id: custId as string,
      formData: data,
      subField: 'base',
    });

    if (response.success) {
      if (submitted) {
        submitted();
        setFormCount(0);
      }
    }
  };

  useEffect(() => {
    const newDetails: ExpensesBase[] = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        values: {
          expenseType: '',
          mapped: 0,
          pension: [65, 65],
          activeEnd: [85, 85],
        },
      });
    }
    setDetails(newDetails);
  }, [formCount]);

  useEffect(() => {
    populateSelectItems();
  }, [custId]);

  const removeDetail = (index: number) => {
    if (details.length > 0) {
      setDetails(removeFormByIndex(details, index));
      setFormCount(formCount - 1);
    }
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
          {loading ? (
            <TableLoader colSpan={5} />
          ) : (
            persons.length &&
            details.map((detail, index) => (
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
                      {...register(`${index}.values.expenseType`, {
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
                      {...register(`${index}.values.mapped`, {
                        required: 'Vänligen fyll i kartlaggt belopp',
                      })}
                    />
                  </TableCell>
                  <TableCell width="20%" />
                  <TableCell width="20%" />
                  <TableCell width="10%" align="right">
                    <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
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
                        label={`Pensionsålder ${person}`}
                        placeholder="Ange belopp"
                        {...register(`${index}.values.pension.${idx}`, {
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
                        label={`Aktiv tid slut ${person}`}
                        placeholder="Ange belopp"
                        {...register(`${index}.values.activeEnd.${idx}`, {
                          required: 'Vänligen fyll i ålder för aktiv tid slut',
                        })}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        label={`Dif ${person} pension`}
                        placeholder="Ange belopp"
                        {...register(`${index}.values.difPension.${idx}`)}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        label={`Dif ${person} aktivt slut`}
                        placeholder="Ange belopp"
                        {...register(`${index}.values.difActiveEnd.${idx}`)}
                      />
                    </TableCell>
                    <TableCell width="20%">
                      <TextField
                        className="form-input-field"
                        {...FormTextFieldProps}
                        type="number"
                        label={`Dif ${person} död`}
                        placeholder="Ange belopp"
                        {...register(`${index}.values.difDeath.${idx}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))
          )}

          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={5} align="right">
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

export default ExpenseBaseForm;
