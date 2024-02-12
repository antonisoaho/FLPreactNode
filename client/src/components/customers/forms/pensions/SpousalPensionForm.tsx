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
import { SpousalPension } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormNumberFieldProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const SpousalPensionForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 6;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: SpousalPension = {
    belongs: '',
    company: '',
    taxFree: undefined,
    compensation: undefined,
    compensationPeriod: '',
    premiumCost: undefined,
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
    item: SpousalPension[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

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
                <TableCell width="20%">
                  <TextField
                    label="Bolag"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.company`)}></TextField>
                </TableCell>
                <TableCell width="10%">
                  <InputLabel shrink className="form-checkbox-label">
                    Skattefri
                  </InputLabel>
                  <Checkbox {...register(`item.${index}.taxFree`)} />
                </TableCell>
                <TableCell width="15%">
                  <TextField
                    required
                    label="Ersättning"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.compensation`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="15%">
                  <TextField
                    label="Utbetalningstid"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.compensationPeriod`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Premie"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.premiumCost`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="15%">
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

export default SpousalPensionForm;
