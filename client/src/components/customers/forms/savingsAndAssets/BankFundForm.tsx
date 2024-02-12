import { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { BankFund } from '../../models/CustomerFormModels';
import {
  CustomFormProps,
  FormNumberFieldProps,
  FormPercentageProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import {
  Button,
  ListItemButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { timePerspectiveSelect } from '../../../../utils/formVariables';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const BankFundForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 5;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: BankFund = {
    belongs: '',
    accountType: '',
    institution: '',
    name: '',
    value: undefined,
    timePerspective: '',
    monthlySavings: undefined,
    saveForHowLong: undefined,
    interestRate: undefined,
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
    item: BankFund[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const accountTypeSelect = [
    {
      value: 'Privatkonto',
      label: 'Privatkonto',
    },
    {
      value: 'Lönekonto',
      label: 'Lönekonto',
    },
    {
      value: 'Sparkonto',
      label: 'Sparkonto',
    },
    {
      value: 'Fasträntekonto',
      label: 'Fasträntekonto',
    },
    {
      value: 'Rörelsekonto',
      label: 'Rörelsekonto',
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
                    label="Tillhör"
                    {...FormSelectProps}
                    {...register(`item.${index}.belongs`, {
                      required: 'Vänligen välj ägare av bankmedel.',
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
                    {...register(`item.${index}.accountType`, {
                      required: 'Vänligen ange vilken typ av konto du har.',
                    })}>
                    {accountTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Bank/Institut"
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
                    required
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
                    type="number"
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
                    label="Månadsspar"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.monthlySavings`)}
                  />
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
                    label="Ränta"
                    {...FormPercentageProps}
                    {...register(`item.${index}.interestRate`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Tänkt tillväxt"
                    {...FormNumberFieldProps}
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

export default BankFundForm;
