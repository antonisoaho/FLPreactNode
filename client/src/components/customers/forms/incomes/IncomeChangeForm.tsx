import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getCustomerNames, updateCustomer } from '../../../../services/api/apiCustomerCalls';
import { snackbarState } from '../../../../services/state/RecoilAtoms';
import { IncomeChange } from '../../models/CustomerFormModels';
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

const IncomeChangeForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IncomeChange[]>();
  const [details, setDetails] = useState<IncomeChange[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);

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

  const onSubmit: SubmitHandler<IncomeChange[]> = async (data) => {
    const response = await updateCustomer({
      field: 'income',
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
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        belongs: '',
        values: {
          changeType: '',
          when: 0,
          newAmount: 0,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell width="20%">
                <TextField
                  className="form-input-select"
                  {...FormTextFieldProps}
                  select
                  required
                  defaultValue={detail.belongs}
                  label="Tillhör"
                  {...register(`${index}.belongs`, {
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
                  className="form-input-select"
                  {...FormTextFieldProps}
                  select
                  required
                  defaultValue={detail.values!.changeType}
                  label="Typ av ändring"
                  {...register(`${index}.values.changeType`, {
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
                  className="form-input-field"
                  required
                  type="number"
                  {...FormTextFieldProps}
                  defaultValue={detail.values!.when}
                  label="Om hur många år"
                  {...register(`${index}.values.when`, { min: 0 })}
                />
              </TableCell>
              <TableCell width="20%">
                <TextField
                  className="form-input-field"
                  required
                  type="number"
                  {...FormTextFieldProps}
                  defaultValue={detail.values!.newAmount}
                  label="Nytt belopp"
                  {...register(`${index}.values.newAmount`)}
                />
              </TableCell>
              <TableCell width="10%" align="right">
                <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
              </TableCell>
            </TableRow>
          ))}
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

export default IncomeChangeForm;
