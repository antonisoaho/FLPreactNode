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
import { useState, useEffect, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  getCustomerNames,
  updateCustomer,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { LiabilityBase, LiabilityPlanned } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { removeFormByIndex } from '../../../../utils/formUtils';
import { DateFields } from '../../../../services/api/models/ApiModel';
import { enqueueSnackbar } from 'notistack';

const LiabilityPlannedForm: React.FC<CustomFormProps> = ({
  submitted,
  formCount,
  setFormCount,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LiabilityPlanned[]>();
  const [details, setDetails] = useState<LiabilityPlanned[]>([]);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);

  const populateSelectItems = async () => {
    const loans = await getCustomerFormData({
      field: 'liabilities',
      subField: 'base',
      _id: custId as string,
    });

    if (loans) {
      setSelectItems((prev) => {
        const currentValues = prev.map((item) => item.value);
        const newLoans = loans
          .data!.filter((loan) => !currentValues.includes(loan._id))
          .map((loan: LiabilityBase & DateFields) => ({
            value: loan._id,
            label: `${loan.name} - ${loan.debt!.toLocaleString()} kr: ${loan._id}`,
          }));

        return [...prev, ...newLoans];
      });
    } else {
      enqueueSnackbar(
        'Kunde inte hitta några befintliga lån att planera kring, vänligen lägg till ett nytt lån.',
        {
          variant: 'error',
        }
      );
    }
  };

  const onSubmit: SubmitHandler<LiabilityPlanned[]> = async (data) => {
    const response = await updateCustomer({
      field: 'liabilities',
      _id: custId as string,
      formData: data,
      subField: 'planned',
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
        loanType: '',
        event: '',
      });
    }
    getCustomerNames(custId!);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {!(selectItems.length > 0) ? (
            <TableRow>
              <TableCell colSpan={3}>
                Kan inte hitta några befintliga lån att planera kring, vänligen lägg till ett nytt
                lån.
              </TableCell>
              <TableCell>
                <ListItemButton onClick={() => setFormCount(formCount - 1)}>Ok</ListItemButton>
              </TableCell>
            </TableRow>
          ) : (
            details.map((detail, index) => (
              <Fragment key={index}>
                <ColoredTableRow>
                  <TableCell colSpan={3}>
                    <TextField
                      className="form-input-select"
                      select
                      required
                      {...FormTextFieldProps}
                      defaultValue={detail.loanType}
                      label="Tillhör"
                      {...register(`${index}.loanType`, {
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
                    <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                  </TableCell>
                </ColoredTableRow>
                <TableRow>
                  <TableCell width="20%">
                    <TextField
                      className="form-input-select"
                      required
                      label="Händelse"
                      {...FormTextFieldProps}
                      {...register(`${index}.event`, {
                        required: 'Vänligen ange vilken lånetyp som gäller.',
                      })}></TextField>
                  </TableCell>
                  <TableCell width="20%">
                    <TextField
                      className="form-input-field"
                      label="När (ant. år)"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.when`, { min: 0 })}
                    />
                  </TableCell>
                  <TableCell width="20%">
                    <TextField
                      className="form-input-field"
                      label="Belopp"
                      {...FormTextFieldProps}
                      {...register(`${index}.amount`, { min: 0 })}
                    />
                  </TableCell>
                  <TableCell width="20%">
                    <TextField
                      className="form-input-field"
                      label="Ränta"
                      type="number"
                      {...FormTextFieldProps}
                      {...register(`${index}.interest`, { min: 0, max: 100 })}
                    />
                  </TableCell>
                </TableRow>
              </Fragment>
            ))
          )}
          {formCount > 0 && selectItems.length > 0 && (
            <TableRow>
              <TableCell colSpan={4} align="right">
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

export default LiabilityPlannedForm;
