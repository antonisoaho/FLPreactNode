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
import { useState, useEffect, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  getCustomerNames,
  getCustomerChildNames,
  updateCustomer,
} from '../../../../services/api/apiCustomerCalls';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { LiabilityBase } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { removeFormByIndex } from '../../../../utils/formUtils';
import { DatePicker } from '@mui/x-date-pickers';
import { enqueueSnackbar } from 'notistack';

const LiabilityBaseForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<LiabilityBase[]>();
  const [details, setDetails] = useState<LiabilityBase[]>([]);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensam', label: 'Gemensam' },
  ]);

  const populateSelectItems = async () => {
    const persons = await getCustomerNames(custId!);
    const children = await getCustomerChildNames(custId!);

    if (persons.success || children.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newPersons = persons
          .data!.filter((name: string) => !currentLabels.includes(name.split(' ')[0]))
          .map((name: string) => ({ value: name, label: name.split(' ')[0] }));
        const newChildren = children
          .data!.filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newPersons, ...newChildren];
      });
    } else {
      enqueueSnackbar('Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.', {
        variant: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<LiabilityBase[]> = async (data) => {
    const response = await updateCustomer({
      field: 'liabilities',
      _id: custId as string,
      formData: data,
      subField: 'base',
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
        belongs: '',
        institution: '',
      });
    }
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <ColoredTableRow>
                <TableCell colSpan={3}>
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue={detail.belongs}
                    label="Tillhör"
                    {...register(`${index}.belongs`, {
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
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </ColoredTableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    required
                    select
                    label="Lånetyp"
                    defaultValue={detail.loanType}
                    {...FormTextFieldProps}
                    {...register(`${index}.loanType`, {
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
                    className="form-input-field"
                    label="Långivare"
                    {...FormTextFieldProps}
                    {...register(`${index}.lender`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Benämning"
                    {...FormTextFieldProps}
                    {...register(`${index}.name`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Skuld"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.debt`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Ränta"
                    inputProps={{ step: 0.01 }}
                    required
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.interest`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Amort (kr/mån)"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.monthlyAmortization`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <DatePicker
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    className="form-input-field"
                    views={['day', 'month', 'year']}
                    {...register(`${index}.lockInterestDate`)}
                    onChange={(date) => {
                      setValue(`${index}.lockInterestDate`, date as Date);
                    }}
                  />
                </TableCell>
                <TableCell width="20%">
                  <InputLabel shrink className="form-checkbox-label">
                    Låneskydd
                  </InputLabel>
                  <Checkbox {...register(`${index}.loanProtection`)} />
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
          {formCount > 0 && (
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

export default LiabilityBaseForm;
