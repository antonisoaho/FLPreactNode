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
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { updateCustomer } from '../../../../../../apiCalls/apiCustomerCalls';
import { InsuranceProperty } from '../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { removeFormByIndex } from '../models/commonFunctions';
import { DatePicker } from '@mui/x-date-pickers';

const PropertyInsuranceForm: React.FC<CustomFormProps> = ({
  submitted,
  formCount,
  setFormCount,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<InsuranceProperty[]>();
  const [details, setDetails] = useState<InsuranceProperty[]>([]);
  const { custId } = useParams();
  const colSpan: number = 6;

  const onSubmit: SubmitHandler<InsuranceProperty[]> = async (data) => {
    const response = await updateCustomer({
      field: 'insurances',
      _id: custId as string,
      formData: data,
      subField: 'property',
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
        company: '',
        propertyType: '',
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

  const paymentPeriodSelect = [
    {
      value: 'Årsvis',
      label: 'Årsvis',
    },
    {
      value: 'Halvårsvis',
      label: 'Halvårsvis',
    },
    {
      value: 'Kvartalsvis',
      label: 'Kvartalsvis',
    },
    {
      value: 'Månadsvis',
      label: 'Månadsvis - Autogiro',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <TableRow>
                <TableCell width="25%">
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue={detail.propertyType}
                    label="Försäkringstyp"
                    {...register(`${index}.propertyType`, {
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
                    {...register(`${index}.company`)}
                  />
                </TableCell>
                <TableCell width="25%">
                  <DatePicker
                    label="Förfallodag"
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    views={['year', 'month', 'day']}
                    {...register(`${index}.expiryDate`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`${index}.expiryDate`, newDate);
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
                    {...register(`${index}.premiumCost`, { min: 0 })}
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
                    {...register(`${index}.paymentPeriod`)}>
                    {paymentPeriodSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="25%">
                  <DatePicker
                    label="Förfallodag"
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    views={['year', 'month', 'day']}
                    {...register(`${index}.lastControl`)}
                    onChange={(date) => {
                      const newDate = date as Date;
                      setValue(`${index}.lastControl`, newDate);
                    }}
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
          {formCount > 0 && details.length > 0 && (
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

export default PropertyInsuranceForm;
