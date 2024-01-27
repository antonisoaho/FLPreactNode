import React, { useEffect, useState } from 'react';
import { CustomerChildren } from './models/CustomerFormModels';
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { formatDate, removeFormByIndex } from './models/commonFunctions';
import { useParams } from 'react-router-dom';
import { CustomFormProps } from './models/FormProps';
import { getCustomerNames } from '../../../../../apiCalls/apiCustomerCalls';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../../../../recoil/RecoilAtoms';

const CustomerChildForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const [details, setDetails] = useState<CustomerChildren[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensamt', label: 'Gemensamt' },
  ]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CustomerChildren[]>();

  const populateSelectItems = async () => {
    const response = await getCustomerNames(custId!);
    if (response.success) {
      setSelectItems((prev) => [
        ...prev,
        ...response.data!.map((name: string) => ({
          value: name,
          label: name,
        })),
      ]);
      console.log('selectItems', selectItems);
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<CustomerChildren[]> = async (data) => {
    if (submitted) submitted();
  };

  useEffect(() => {
    populateSelectItems();
  }, []);

  useEffect(() => {
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        name: '',
        yearMonth: '',
        belongs: '',
        childSupportCounts: true,
        livesAtHomeToAge: 20,
      });
    }
    setDetails(newDetails);
  }, [formCount]);

  const removeDetail = (index: number) => {
    if (details.length > 0) {
      setDetails(removeFormByIndex(details, index));
      setFormCount(formCount - 1);
    }
  };

  const handleDateChange = (date: Date, index: number) => {
    const newDate = formatDate(date);
    setValue(`${index}.yearMonth`, newDate);
  };

  const inputProps = {
    sx: { m: 0, width: '100%' },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  label="Namn"
                  {...register(`${index}.name`, { required: 'Vänligen ange ett namn.' })}
                  {...inputProps}
                />
              </TableCell>
              <TableCell>
                <FormControl>
                  <InputLabel id="belongs-label">Tillhör</InputLabel>
                  <Select
                    defaultValue={detail.belongs}
                    labelId="belongs-label"
                    label="tillhör"
                    {...register(`${index}.belongs`, {
                      required: 'Vänligen välj ett alternativ.',
                    })}>
                    {selectItems.map((item) => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Checkbox {...register(`${index}.childSupportCounts`)} />
              </TableCell>
              <TableCell>
                <DatePicker
                  label="Född"
                  views={['month', 'year']}
                  {...register(`${index}.yearMonth`, { required: 'Var vänlig välj ett datum.' })}
                  onChange={(date) => handleDateChange(date as Date, index)}
                  {...inputProps}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  {...register(`${index}.livesAtHomeToAge`)}
                  label="Bor hemma till"
                />
              </TableCell>
              <TableCell align="right">
                <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
              </TableCell>
            </TableRow>
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

export default CustomerChildForm;
