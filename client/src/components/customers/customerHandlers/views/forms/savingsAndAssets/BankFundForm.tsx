import { useState, useEffect, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getCustomerNames, updateCustomer } from '../../../../../../apiCalls/apiCustomerCalls';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';
import { BankFund } from '../models/CustomerFormModels';
import { removeFormByIndex } from '../models/commonFunctions';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
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
import ColoredTableRow from '../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { timePerspectiveSelect } from '../../variables/variables';

const BankFundForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<BankFund[]>();
  const [details, setDetails] = useState<BankFund[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const colSpan: number = 5;
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensam', label: 'Gemensam' },
  ]);

  const populateSelectItems = async () => {
    const response = await getCustomerNames(custId!);
    if (response.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newItems = response
          .data!.filter((name: string) => !currentLabels.includes(name.split(' ')[0]))
          .map((name: string) => ({ value: name, label: name.split(' ')[0] }));

        return [...prev, ...newItems];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<BankFund[]> = async (data) => {
    const response = await updateCustomer({
      field: 'bankFunds',
      _id: custId as string,
      formData: data,
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
        belongs: '',
        accountType: '',
        institution: '',
        timePerspective: '',
        name: '',
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <ColoredTableRow>
                <TableCell colSpan={colSpan - 1}>
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue={detail.belongs}
                    label="Tillhör"
                    {...register(`${index}.belongs`, {
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
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </ColoredTableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    required
                    select
                    defaultValue={detail.accountType}
                    label="Kontotyp"
                    {...FormTextFieldProps}
                    {...register(`${index}.accountType`, {
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
                    className="form-input-field"
                    label="Bank/Institut"
                    {...FormTextFieldProps}
                    {...register(`${index}.institution`)}
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
                    required
                    select
                    className="form-input-field"
                    label="Tidsperspektiv"
                    defaultValue={detail.timePerspective}
                    fullWidth
                    {...FormTextFieldProps}
                    {...register(`${index}.timePerspective`)}>
                    {timePerspectiveSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Saldo"
                    type="number"
                    required
                    {...FormTextFieldProps}
                    {...register(`${index}.value`, {
                      required: 'Vänligen ange värdet på bankmedel.',
                      min: 0,
                    })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Månadsspar"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.monthlySavings`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Spartid (år)"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.saveForHowLong`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Ränta"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.interestRate`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Tänkt tillväxt"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.projectedGrowth`)}
                  />
                </TableCell>
                <TableCell />
              </TableRow>
            </Fragment>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={colSpan} align="right">
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

export default BankFundForm;
