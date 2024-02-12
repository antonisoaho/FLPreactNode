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
import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { InsuranceSickness } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { DatePicker } from '@mui/x-date-pickers';
import {
  compensationPeriodSickness,
  qualifyingPeriodSickness,
} from '../../../../utils/formVariables';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const SickInsuranceForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 5;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: InsuranceSickness = {
    belongs: '',
    company: '',
    insuranceType: '',
    taxFree: false,
    qualifyingPeriod: undefined,
    compensationAmount: undefined,
    compensationPeriod: undefined,
    premiumCost: undefined,
    expiryDate: undefined,
    lastUpdated: undefined,
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
    item: InsuranceSickness[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
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
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue=""
                    label="Försäkrad"
                    {...register(`item.${index}.belongs`, {
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
                  <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
                </TableCell>
              </ColoredTableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    label="Bolag"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.company`)}></TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    label="Benämning"
                    fullWidth
                    select
                    defaultValue=""
                    {...FormTextFieldProps}
                    {...register(`item.${index}.insuranceType`)}>
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
                  <Checkbox {...register(`item.${index}.taxFree`)} />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Karens"
                    defaultValue=""
                    select
                    fullWidth
                    {...FormTextFieldProps}
                    {...register(`item.${index}.qualifyingPeriod`)}>
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
                    {...register(`item.${index}.compensationAmount`, { min: 0 })}
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
                    {...register(`item.${index}.premiumCost`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <DatePicker
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    label="Förfallodatum"
                    views={['day', 'month', 'year']}
                    {...register(`item.${index}.expiryDate`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`item.${index}.expiryDate`, newDate);
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
                    {...register(`item.${index}.compensationPeriod`)}>
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
                    {...register(`item.${index}.lastUpdated`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`item.${index}.lastUpdated`, newDate);
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

export default SickInsuranceForm;
