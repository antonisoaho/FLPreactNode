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
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getCustomerNames, updateCustomer } from '../../../../../../apiCalls/apiCustomerCalls';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';
import TableLoader from '../../table/TableLoader';
import { InsuranceWork } from '../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { removeFormByIndex } from '../models/commonFunctions';

const WorkInsuranceForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InsuranceWork[]>();
  const [details, setDetails] = useState<InsuranceWork[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);
  const colSpan: number = 3;

  const populateSelectItems = async () => {
    const persons = await getCustomerNames(custId!);

    if (persons.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newPersons = persons
          .data!.filter((name: string) => !currentLabels.includes(name.split(' ')[0]))
          .map((name: string) => ({ value: name, label: name.split(' ')[0] }));

        return [...prev, ...newPersons];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<InsuranceWork[]> = async (data) => {
    const response = await updateCustomer({
      field: 'insurances',
      _id: custId as string,
      formData: data,
      subField: 'work',
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
        insuranceType: '',
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {!selectItems.length ? (
            <TableLoader colSpan={colSpan} />
          ) : (
            details.map((detail, index) => (
              <TableRow key={index}>
                <TableCell width="40%">
                  <TextField
                    className="form-input-select"
                    select
                    required
                    fullWidth
                    {...FormTextFieldProps}
                    defaultValue={detail.belongs}
                    label="Försäkrad"
                    {...register(`${index}.belongs`, {
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
                    className="form-input-select"
                    select
                    required
                    fullWidth
                    {...FormTextFieldProps}
                    defaultValue={detail.insuranceType}
                    label="Försäkringstyp"
                    {...register(`${index}.insuranceType`, {
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
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </TableRow>
            ))
          )}
          {formCount > 0 && selectItems.length > 0 && (
            <TableRow>
              <TableCell colSpan={colSpan} align="right">
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

export default WorkInsuranceForm;
