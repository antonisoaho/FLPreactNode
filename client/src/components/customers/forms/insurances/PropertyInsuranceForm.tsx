import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import React, { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { InsuranceProperty } from '../../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../../models/FormProps';
import { DatePicker } from '@mui/x-date-pickers';
import { paymentPeriodSelect } from '../../../../utils/formVariables';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';

const PropertyInsuranceForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 6;
  const sendToServer = useSubmitCustomerForm(formFields);

  const details: InsuranceProperty = {
    propertyType: '',
    company: '',
    expiryDate: undefined,
    premiumCost: undefined,
    paymentPeriod: '',
    lastControl: undefined,
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
    item: InsuranceProperty[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  const insuranceTypeSelect = [
    {
      value: 'Villa/Hem',
      label: 'Villa/Hem',
    },
    {
      value: 'Hem',
      label: 'Hem',
    },
    {
      value: 'Bostadsrätt',
      label: 'Bostadsrätt',
    },
    {
      value: 'Fritidshus',
      label: 'Fritidshus',
    },
    {
      value: 'Fordon',
      label: 'Fordon',
    },
    {
      value: 'Husbil',
      label: 'Husbil',
    },
    {
      value: 'Husvagn',
      label: 'Husvagn',
    },
    {
      value: 'Släpkärra',
      label: 'Släpkärra',
    },
    {
      value: 'Båt',
      label: 'Båt',
    },
    {
      value: 'Spec. egendom',
      label: 'Spec. egendom',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {fields.map((detail, index) => (
            <Fragment key={detail.id}>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue=""
                    label="Försäkringstyp"
                    {...register(`item.${index}.propertyType`, {
                      required: 'Vänligen välj vilken typ av egendom det gäller.',
                    })}>
                    {insuranceTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    label="Bolag"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.company`)}
                  />
                </TableCell>
                <TableCell width="25%">
                  <DatePicker
                    label="Förfallodag"
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    views={['year', 'month', 'day']}
                    {...register(`item.${index}.expiryDate`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`item.${index}.expiryDate`, newDate);
                    }}
                  />
                </TableCell>
                <TableCell width="25%">
                  <TextField
                    label="Premie"
                    type="number"
                    required
                    className="form-input-field"
                    {...FormTextFieldProps}
                    {...register(`item.${index}.premiumCost`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    label="Betalningsperiod"
                    select
                    fullWidth
                    {...FormTextFieldProps}
                    {...register(`item.${index}.paymentPeriod`)}>
                    {paymentPeriodSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <DatePicker
                    label="Senast kontroll"
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    views={['day', 'month', 'year']}
                    {...register(`item.${index}.lastControl`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`item.${index}.lastControl`, newDate);
                    }}
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
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

export default PropertyInsuranceForm;
