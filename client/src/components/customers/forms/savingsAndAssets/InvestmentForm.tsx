import {
  Table,
  TableBody,
  TableCell,
  TextField,
  MenuItem,
  TableRow,
  ListItemButton,
  Button,
} from '@mui/material';
import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { Investment } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormNumberFieldProps,
  FormPercentageProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import { timePerspectiveSelect } from '../../../../utils/formVariables';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const InvestmentForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 5;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, [
    { value: 'Gemensam', label: 'Gemensam' },
  ]);

  const details: Investment = {
    investmentType: '',
    institution: '',
    name: '',
    belongs: '',
    depositedAmount: undefined,
    value: undefined,
    riskClass: undefined,
    managementFee: undefined,
    shellFee: undefined,
    timePerspective: '',
    monthlySavings: undefined,
    saveForHowLong: undefined,
    additionalInvestment: undefined,
    when: undefined,
    projectedGrowth: undefined,
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
    item: Investment[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const investmentTypeSelect = [
    {
      value: 'Fondkonto',
      label: 'Fondkonto',
    },
    {
      value: 'Fond/aktiedepå',
      label: 'Fond/aktiedepå',
    },
    {
      value: 'ISK',
      label: 'ISK',
    },
    {
      value: 'Kapitalförsäkring',
      label: 'Kapitalförsäkring',
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
                    label="Tillhör"
                    {...register(`item.${index}.belongs`, {
                      required: 'Vänligen välj ägare av sparande.',
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
                    required
                    label="Kontotyp"
                    {...FormSelectProps}
                    {...register(`item.${index}.investmentType`, {
                      required: 'Vänligen ange vilken typ av investering.',
                    })}>
                    {investmentTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Institut"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.institution`)}
                  />
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
                    label="Insatt"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.depositedAmount`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Saldo"
                    required
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.value`, {
                      required: 'Vänligen ange värdet på bankmedel.',
                      min: 0,
                    })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    label="Tidsperspektiv"
                    {...FormSelectProps}
                    {...register(`item.${index}.timePerspective`)}>
                    {timePerspectiveSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Spartid (år)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.saveForHowLong`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Riskklass"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.riskClass`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    type="number"
                    {...FormPercentageProps}
                    {...register(`item.${index}.managementFee`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    type="number"
                    {...FormPercentageProps}
                    {...register(`item.${index}.shellFee`)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    label="Månadsspar"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.monthlySavings`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Tilläggsinvestering"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.additionalInvestment`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Tilläggs när"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.when`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Tänkt tillväxt"
                    {...FormPercentageProps}
                    {...register(`item.${index}.projectedGrowth`)}
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

export default InvestmentForm;
