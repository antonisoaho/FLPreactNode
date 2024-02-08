import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton,
  TextField,
  MenuItem,
  Button,
  InputLabel,
  Checkbox,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  updateCustomer,
  getCustomerNames,
  getCustomerChildNames,
} from '../../../../services/api/apiCustomerCalls';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { InsuranceSickness } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { removeFormByIndex } from '../../../../utils/formUtils';
import { DatePicker } from '@mui/x-date-pickers';
import {
  compensationPeriodSickness,
  qualifyingPeriodSickness,
} from '../../../../utils/formVariables';
import { enqueueSnackbar } from 'notistack';

const SickInsuranceForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<InsuranceSickness[]>();
  const [details, setDetails] = useState<InsuranceSickness[]>([]);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);
  const colSpan: number = 5;

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
      enqueueSnackbar('Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.', {
        variant: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<InsuranceSickness[]> = async (data) => {
    const response = await updateCustomer({
      field: 'insurances',
      _id: custId as string,
      formData: data,
      subField: 'sickness',
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
      value: 'Sjukförs. Arbete',
      label: 'Sjukförs. Arbete',
    },
    {
      value: 'Privat sjukförs.',
      label: 'Privat sjukförs.',
    },
    {
      value: 'Diagnosförs.',
      label: 'Diagnosförs.',
    },
    {
      value: 'Privatvårdsförs.',
      label: 'Privatvårdsförs.',
    },
    {
      value: 'Förtidskapital',
      label: 'Förtidskapital',
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
                      required: 'Vänligen välj vem försäkringen gäller.',
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
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    label="Bolag"
                    {...FormTextFieldProps}
                    {...register(`${index}.company`)}></TextField>
                </TableCell>
                <TableCell width="20%">
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
                <TableCell width="20%">
                  <InputLabel shrink className="form-input-label">
                    Skattefri
                  </InputLabel>
                  <Checkbox {...register(`${index}.taxFree`)} />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Karens"
                    defaultValue=""
                    select
                    fullWidth
                    {...FormTextFieldProps}
                    {...register(`${index}.qualifyingPeriod`)}>
                    {qualifyingPeriodSickness.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Ersättning"
                    type="number"
                    required
                    {...FormTextFieldProps}
                    {...register(`${index}.compensationAmount`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Premie (kr/år)"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.premiumCost`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
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
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    select
                    fullWidth
                    {...FormTextFieldProps}
                    defaultValue=""
                    label="Ersättningstid"
                    {...register(`${index}.compensationPeriod`)}>
                    {compensationPeriodSickness.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <DatePicker
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    label="Senaste uppdatering"
                    views={['day', 'month', 'year']}
                    {...register(`${index}.lastUpdated`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`${index}.lastUpdated`, newDate);
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

export default SickInsuranceForm;
