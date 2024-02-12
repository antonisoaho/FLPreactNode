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
import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { CustomerPension } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormNumberFieldProps,
  FormPercentageProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { pensionCompensationPeriodSelect } from '../../../../utils/formVariables';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const PensionForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: CustomerPension = {
    belongs: '',
    company: '',
    pensionType: '',
    pensionName: '',
    pensionValue: undefined,
    pensionAge: undefined,
    monthlyPension: undefined,
    compensationPeriod: undefined,
    shellFee: undefined,
    riskClass: undefined,
    fundFee: undefined,
    estIncreasedValue: undefined,
    annualSavings: undefined,
    commitmentPowers: undefined,
    spousalProtection: undefined,
    timeAfterDeath: undefined,
    beneficiary: '',
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
    item: CustomerPension[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
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
                    {...FormSelectProps}
                    label="Försäkrad"
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
                    {...register(`item.${index}.company`)}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    required
                    label="Pensionstyp"
                    {...FormSelectProps}
                    {...register(`item.${index}.pensionType`)}>
                    {pensionTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    required
                    label="Benämning"
                    {...FormSelectProps}
                    {...register(`item.${index}.pensionName`)}>
                    {pensionNameSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Värde"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.pensionValue`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    label="Pensionsålder"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.pensionAge`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Gar.pens (kr/mån)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.monthlyPension`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Utbet. Tid"
                    {...FormSelectProps}
                    {...register(`item.${index}.compensationPeriod`)}>
                    {pensionCompensationPeriodSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Skalavgift"
                    {...FormPercentageProps}
                    {...register(`item.${index}.shellFee`, { min: 0, max: 100 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    label="Vägd risk"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.riskClass`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Vägd fondavg."
                    {...FormPercentageProps}
                    {...register(`item.${index}.fundFee`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Ber. Värdeökning"
                    {...FormPercentageProps}
                    {...register(`item.${index}.estIncreasedValue`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Sparande (kr/år)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.annualSavings`)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="25%">
                  <InputLabel shrink className="form-checkbox-label">
                    ÅB-skydd
                  </InputLabel>
                  <Checkbox {...register(`item.${index}.commitmentPowers`)} />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Eft.skydd (kr/år)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.spousalProtection`)}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Uttid (död)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.timeAfterDeath`)}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Förmånstagare"
                    {...FormSelectProps}
                    {...register(`item.${index}.beneficiary`)}>
                    {beneficiarySelectItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
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

export default PensionForm;
