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
import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { InsuranceLife } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormDateProps,
  FormNumberFieldProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import { DatePicker } from '@mui/x-date-pickers';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const LifeInsuranceForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: InsuranceLife = {
    belongs: '',
    company: '',
    insuranceType: '',
    compensationAmount: undefined,
    premiumCost: undefined,
    expiryDate: undefined,
    beneficiary: '',
    lastControl: undefined,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
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
    item: InsuranceLife[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
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
          {fields.map((detail, index) => (
            <Fragment key={detail.id}>
              <ColoredTableRow>
                <TableCell colSpan={colSpan - 1}>
                  <TextField
                    required
                    label="Försäkrad"
                    {...FormSelectProps}
                    {...register(`item.${index}.belongs`, {
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
                  <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
                </TableCell>
              </ColoredTableRow>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    label="Bolag"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.company`)}></TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Benämning"
                    {...FormSelectProps}
                    {...register(`item.${index}.insuranceType`)}>
                    {insuranceTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    required
                    label="Ersättning"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.compensationAmount`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Premie (kr/år)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.premiumCost`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="25%">
                  <DatePicker
                    {...FormDateProps}
                    label="Förfallodatum"
                    views={['day', 'month', 'year']}
                    {...register(`item.${index}.expiryDate`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`item.${index}.expiryDate`, newDate);
                    }}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    required
                    {...FormSelectProps}
                    label="Förmånstagare"
                    {...register(`item.${index}.beneficiary`, {
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
                    {...FormDateProps}
                    label="Senast kontroll"
                    views={['year', 'month', 'day']}
                    {...register(`item.${index}.lastControl`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`item.${index}.lastControl`, newDate);
                    }}
                  />
                </TableCell>
                <TableCell />
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

export default LifeInsuranceForm;
