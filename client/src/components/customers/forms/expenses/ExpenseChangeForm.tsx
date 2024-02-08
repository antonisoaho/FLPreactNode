import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { updateCustomer } from '../../../../services/api/apiCustomerCalls';
import { ExpensesChange } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { removeFormByIndex } from '../../../../utils/formUtils';
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

const ExpenseChangeForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ExpensesChange[]>();
  const [details, setDetails] = useState<ExpensesChange[]>([]);
  const { custId } = useParams();

  const onSubmit: SubmitHandler<ExpensesChange[]> = async (data) => {
    const response = await updateCustomer({
      field: 'expenses',
      _id: custId as string,
      formData: data,
      subField: 'change',
    });

    if (response.success) {
      if (submitted) {
        submitted();
        setFormCount(0);
      }
    }
  };

  useEffect(() => {
    const newDetails: ExpensesChange[] = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        values: {
          changeType: '',
          comment: '',
        },
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
          {details.length > 0 &&
            details.map((detail, index) => (
              <Fragment key={index}>
                <TableRow>
                  <TableCell width="15%">
                    <TextField
                      className="form-input-select"
                      {...FormTextFieldProps}
                      select
                      required
                      defaultValue={detail.values!.changeType}
                      label="Utgiftstyp"
                      {...register(`${index}.values.changeType`, {
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
                      type="number"
                      required
                      className="form-input-field"
                      {...FormTextFieldProps}
                      {...register(`${index}.values.when`, {
                        min: 0,
                        max: 100,
                      })}
                      label="Om hur många år?"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      type="number"
                      required
                      className="form-input-field"
                      {...FormTextFieldProps}
                      {...register(`${index}.values.ongoing`, {
                        min: 0,
                        max: 100,
                      })}
                      label="Hur länge?"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      type="number"
                      required
                      className="form-input-field"
                      {...FormTextFieldProps}
                      {...register(`${index}.values.value`)}
                      label="Belopp"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <TextField
                      className="form-input-field"
                      {...FormTextFieldProps}
                      {...register(`${index}.values.comment`)}
                      label="Kommentar"
                    />
                  </TableCell>
                  <TableCell width="10%" align="right">
                    <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                  </TableCell>
                </TableRow>
              </Fragment>
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

export default ExpenseChangeForm;
