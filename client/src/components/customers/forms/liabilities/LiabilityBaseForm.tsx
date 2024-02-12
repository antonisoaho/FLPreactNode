import {
  Table,
  TableBody,
  TableCell,
  TextField,
  MenuItem,
  ListItemButton,
  TableRow,
  Button,
  Checkbox,
  InputLabel,
} from '@mui/material';
import { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { LiabilityBase } from '../../models/CustomerFormModels';
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

const LiabilityBaseForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);

  const details: LiabilityBase = {
    loanType: '',
    lender: '',
    name: '',
    belongs: '',
    debt: undefined,
    interest: undefined,
    monthlyAmortization: undefined,
    lockInterestDate: undefined,
    loanProtection: undefined,
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
    item: LiabilityBase[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const liabilityTypeSelect = [
    {
      value: 'Pantbrevslån',
      label: 'Pantbrevslån',
    },
    {
      value: 'Banklån',
      label: 'Banklån',
    },
    {
      value: 'Billån',
      label: 'Billån',
    },
    {
      value: 'Checkkredit',
      label: 'Checkkredit',
    },
    {
      value: 'CSN',
      label: 'CSN',
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
                <TableCell colSpan={3}>
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
                    label="Lånetyp"
                    {...FormSelectProps}
                    {...register(`item.${index}.loanType`, {
                      required: 'Vänligen ange vilken lånetyp som gäller.',
                    })}>
                    {liabilityTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Långivare"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.lender`)}
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
                    label="Skuld"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.debt`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    label="Ränta"
                    required
                    {...FormPercentageProps}
                    {...register(`item.${index}.interest`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    label="Amort (kr/mån)"
                    {...FormNumberFieldProps}
                    {...register(`item.${index}.monthlyAmortization`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <DatePicker
                    {...FormDateProps}
                    views={['day', 'month', 'year']}
                    {...register(`item.${index}.lockInterestDate`)}
                    onChange={(date) => {
                      setValue(`item.${index}.lockInterestDate`, date as Date);
                    }}
                  />
                </TableCell>
                <TableCell width="20%">
                  <InputLabel shrink className="form-checkbox-label">
                    Låneskydd
                  </InputLabel>
                  <Checkbox {...register(`item.${index}.loanProtection`)} />
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

export default LiabilityBaseForm;
