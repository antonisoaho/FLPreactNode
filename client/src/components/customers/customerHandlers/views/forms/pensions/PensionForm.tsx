import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  InputLabel,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { updateCustomer, getCustomerNames } from '../../../../../../apiCalls/apiCustomerCalls';
import ColoredTableRow from '../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';
import { CustomerPension } from '../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { removeFormByIndex } from '../models/commonFunctions';
import TableLoader from '../../table/TableLoader';

const PensionForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CustomerPension[]>();
  const [details, setDetails] = useState<CustomerPension[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);
  const [compensationPeriodSelect, setCompensationPeriodSelect] = useState<
    Array<{ value: number; label: string }>
  >([
    {
      value: 0,
      label: 'Livslång',
    },
  ]);
  const colSpan: number = 4;

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

  const onSubmit: SubmitHandler<CustomerPension[]> = async (data) => {
    const response = await updateCustomer({
      field: 'pension',
      _id: custId as string,
      formData: data,
    });

    if (response.success) {
      if (submitted) {
        submitted();
        setFormCount(0);
      }
    }
  };

  const makeCompensationPeriodSelect = () => {
    if (compensationPeriodSelect.length == 1) {
      setCompensationPeriodSelect((prev) => {
        const newSelects = [];
        for (let i = 1; i <= 40; i++) {
          newSelects.push({ label: i.toString() + ' år', value: i });
        }
        return [...prev, ...newSelects];
      });
    }
  };

  useEffect(() => {
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        belongs: '',
        pensionName: '',
        pensionType: '',
        beneficiary: '',
        compensationPeriod: 0,
      });
    }
    setDetails(newDetails);
  }, [formCount]);

  useEffect(() => {
    populateSelectItems();
    makeCompensationPeriodSelect();
  }, [custId]);

  const removeDetail = (index: number) => {
    if (details.length > 0) {
      setDetails(removeFormByIndex(details, index));
      setFormCount(formCount - 1);
    }
  };

  const pensionTypeSelect = [
    {
      value: 'Traditionell',
      label: 'Traditionell',
    },
    {
      value: 'Förmånsstyrd',
      label: 'Förmånsstyrd',
    },
    {
      value: 'Fond',
      label: 'Fond',
    },
  ];

  const pensionNameSelect = [
    {
      value: 'Inkomstpens.',
      label: 'Inkomstpens.',
    },
    {
      value: 'Premisepens.',
      label: 'Premisepens.',
    },
    {
      value: 'Tjänstepens.',
      label: 'Tjänstepens.',
    },
    {
      value: 'Privat pens.',
      label: 'Privat pens.',
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
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {compensationPeriodSelect.length == 1 ? (
            <TableLoader colSpan={colSpan} />
          ) : (
            details.map((detail, index) => (
              <Fragment key={index}>
                <ColoredTableRow>
                  <TableCell colSpan={colSpan - 1}>
                    <TextField
                      className="form-input-select"
                      select
                      required
                      fullWidth
                      {...FormTextFieldProps}
                      defaultValue={detail.belongs}
                      label="Försäkrad"
                      {...register(`${index}.belongs`, {
                        required: 'Vänligen välj vem pensionen gäller.',
                      })}>
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
                      {...register(`${index}.company`)}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      fullWidth
                      required
                      select
                      defaultValue={detail.pensionType}
                      label="Pensionstyp"
                      className="form-input-select"
                      {...FormTextFieldProps}
                      {...register(`${index}.pensionType`)}>
                      {pensionTypeSelect.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      required
                      select
                      fullWidth
                      defaultValue={detail.pensionName}
                      label="Benämning"
                      {...FormTextFieldProps}
                      {...register(`${index}.pensionName`)}>
                      {pensionNameSelect.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Värde"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.pensionValue`, { min: 0 })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Pensionsålder"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.pensionAge`, { min: 0 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Gar.pens (kr/mån)"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.monthlyPension`, { min: 0 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Utbet. Tid"
                      select
                      fullWidth
                      defaultValue={detail.compensationPeriod}
                      {...FormTextFieldProps}
                      {...register(`${index}.compensationPeriod`)}>
                      {compensationPeriodSelect.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Skalavgift"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.shellFee`, { min: 0, max: 100 })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Vägd risk"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.riskClass`, { min: 0, max: 100 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Vägd fondavg."
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.fundFee`, { min: 0, max: 100 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Ber. Värdeökning"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.estIncreasedValue`, { min: 0, max: 100 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Sparande (kr/år)"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.annualSavings`)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="25%">
                    <InputLabel shrink className="form-checkbox-label">
                      ÅB-skydd
                    </InputLabel>
                    <Checkbox {...register(`${index}.commitmentPowers`)} />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Eft.skydd (kr/år)"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.spousalProtection`)}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Uttid (död)"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.timeAfterDeath`)}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      className="form-input-field"
                      label="Förmånstagare"
                      select
                      fullWidth
                      defaultValue={detail.beneficiary}
                      {...FormTextFieldProps}
                      {...register(`${index}.beneficiary`)}>
                      {beneficiarySelectItems.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              </Fragment>
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

export default PensionForm;
