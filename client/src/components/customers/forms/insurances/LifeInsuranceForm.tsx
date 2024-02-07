import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  updateCustomer,
  getCustomerNames,
  getCustomerChildNames,
} from '../../../../services/api/apiCustomerCalls';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { snackbarState } from '../../../../services/state/RecoilAtoms';
import { InsuranceLife } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { removeFormByIndex } from '../../../../utils/commonFunctions';
import { DatePicker } from '@mui/x-date-pickers';

const LifeInsuranceForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<InsuranceLife[]>();
  const [details, setDetails] = useState<InsuranceLife[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);
  const colSpan: number = 4;

  const populateSelectItems = async () => {
    const persons = await getCustomerNames(custId!);
    const children = await getCustomerChildNames(custId!);

    if (persons.success || children.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newPersons = persons
          .data!.filter((name: string) => !currentLabels.includes(name.split(' ')[0]))
          .map((name: string) => ({ value: name, label: name.split(' ')[0] }));
        const newChildren = children
          .data!.filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newPersons, ...newChildren];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<InsuranceLife[]> = async (data) => {
    const response = await updateCustomer({
      field: 'insurances',
      _id: custId as string,
      formData: data,
      subField: 'life',
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
        company: '',
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

  const insuranceTypeSelect = [
    {
      value: 'Livförsäkring',
      label: 'Livförsäkring',
    },
  ];
  const beneficiarySelectItems = [
    {
      value: '1. M/S 2. Barn',
      label: '1. M/S 2. Barn',
    },
    {
      value: '1. Barn 2. M/S',
      label: '1. Barn 2. M/S',
    },
    {
      value: 'M/S & Barn',
      label: 'M/S & Barn',
    },
    {
      value: 'Arvingar',
      label: 'Arvingar',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <ColoredTableRow>
                <TableCell colSpan={colSpan - 1}>
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue={detail.belongs}
                    label="Försäkrad"
                    {...register(`${index}.belongs`, {
                      required: 'Vänligen välj vem pensionen gäller.',
                    })}
                    fullWidth>
                    {selectItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </ColoredTableRow>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    label="Bolag"
                    {...FormTextFieldProps}
                    {...register(`${index}.company`)}></TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    label="Benämning"
                    fullWidth
                    select
                    defaultValue={detail.insuranceType}
                    {...FormTextFieldProps}
                    {...register(`${index}.insuranceType`)}>
                    {insuranceTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    className="form-input-field"
                    type="number"
                    required
                    label="Ersättning"
                    {...FormTextFieldProps}
                    {...register(`${index}.compensationAmount`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    className="form-input-field"
                    label="Premie (kr/år)"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.premiumCost`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="25%">
                  <DatePicker
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    label="Förfallodatum"
                    views={['day', 'month', 'year']}
                    {...register(`${index}.expiryDate`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`${index}.expiryDate`, newDate);
                    }}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    select
                    required
                    fullWidth
                    {...FormTextFieldProps}
                    defaultValue=""
                    label="Förmånstagare"
                    {...register(`${index}.beneficiary`, {
                      required: 'Vänligen välj vem pensionen gäller.',
                    })}>
                    {beneficiarySelectItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <DatePicker
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    label="Senast kontroll"
                    views={['year', 'month', 'day']}
                    {...register(`${index}.lastControl`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`${index}.lastControl`, newDate);
                    }}
                  />
                </TableCell>

                <TableCell>
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
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

export default LifeInsuranceForm;
