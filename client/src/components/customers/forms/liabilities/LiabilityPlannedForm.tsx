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
import { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import {
  CustomFormProps,
  FormNumberFieldProps,
  FormPercentageProps,
  FormSelectProps,
  FormTextFieldProps,
} from '../../models/FormProps';
import { useGetCustomerBaseLiabilityLabels } from '../../../../hooks/customer/useGetCustomerBaseLiabilityLabels';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import { LiabilityPlanned } from '../../models/CustomerFormModels';

const LiabilityPlannedForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 3;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerBaseLiabilityLabels(formFields.custId, []);

  const details: LiabilityPlanned = {
    loanType: '',
    event: '',
    when: '',
    amount: undefined,
    interest: undefined,
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
    item: LiabilityPlanned[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

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
          {!(selectItems.length > 0) ? (
            <TableRow>
              <TableCell colSpan={colSpan - 1}>
                Kan inte hitta några befintliga lån att planera kring, vänligen lägg till ett nytt
                lån.
              </TableCell>
              <TableCell>
                <Button disabled={isSubmitting} onClick={() => setFormOpen(false)}>
                  Avbryt
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            fields.map((detail, index) => (
              <Fragment key={detail.id}>
                <ColoredTableRow>
                  <TableCell colSpan={colSpan - 1}>
                    <TextField
                      {...FormSelectProps}
                      required
                      label="Tillhör"
                      {...register(`item.${index}.loanType`, {
                        required: 'Vänligen välj vilket lån det gäller.',
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
                      label="Händelse"
                      {...FormTextFieldProps}
                      {...register(`item.${index}.event`)}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      label="När (ant. år)"
                      {...FormNumberFieldProps}
                      {...register(`item.${index}.when`, { min: 0 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      label="Belopp"
                      {...FormTextFieldProps}
                      {...register(`item.${index}.amount`, { min: 0 })}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <TextField
                      label="Ränta"
                      {...FormPercentageProps}
                      {...register(`item.${index}.interest`, { min: 0, max: 100 })}
                    />
                  </TableCell>
                </TableRow>
              </Fragment>
            ))
          )}
          {selectItems.length > 0 && (
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
          )}
        </TableBody>
      </Table>
    </form>
  );
};

export default LiabilityPlannedForm;
