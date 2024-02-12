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
import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { Assets } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormDateProps,
  FormNumberFieldProps,
  FormPercentageProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import { DatePicker } from '@mui/x-date-pickers';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const AssetsForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 5;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, [
    { value: 'Gemesam', label: 'Gemensam' },
  ]);

  const details: Assets = {
    assetType: '',
    name: '',
    value: undefined,
    stake: undefined,
    mortgageDeed: undefined,
    valueYear: undefined,
    belongs: '',
    tax: undefined,
    assessedValue: undefined,
    base: undefined,
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
    item: Assets[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const AssetsTypeSelect = [
    {
      value: 'Bostad',
      label: 'Bostad',
    },
    {
      value: 'Fastighet',
      label: 'Fastighet',
    },
    {
      value: 'Skog',
      label: 'Skog',
    },
    {
      value: 'Fordon',
      label: 'Fordon',
    },
    {
      value: 'Företag',
      label: 'Företag',
    },
    {
      value: 'Antikviteter',
      label: 'Antikviteter',
    },
    {
      value: 'Övrigt',
      label: 'Övrigt',
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
                    {...FormSelectProps}
                    required
                    label="Tillhör"
                    {...register(`item.${index}.belongs`, {
                      required: 'Vänligen välj ägare av egendom.',
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
                    {...FormSelectProps}
                    required
                    label="Tillgångstyp"
                    {...register(`item.${index}.assetType`, {
                      required: 'Vänligen ange vilken typ av investering.',
                    })}>
                    {AssetsTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Benämning"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.name`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Värde"
                    required
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.value`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Insats"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.stake`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Pantbrev"
                    {...FormPercentageProps}
                    {...register(`item.${index}.mortgageDeed`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <DatePicker
                    {...FormDateProps}
                    label="Värderingsår"
                    views={['year']}
                    {...register(`item.${index}.valueYear`, { max: new Date().getFullYear() })}
                    onChange={(date) => {
                      const newDate = date as Date;
                      const newDateValue = newDate.getFullYear();
                      setValue(`item.${index}.valueYear`, newDateValue);
                    }}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    {...FormPercentageProps}
                    label="Skatt"
                    {...register(`item.${index}.tax`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Taxeringsvärde"
                    {...FormPercentageProps}
                    {...register(`item.${index}.assessedValue`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Rot"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.base`)}
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

export default AssetsForm;
