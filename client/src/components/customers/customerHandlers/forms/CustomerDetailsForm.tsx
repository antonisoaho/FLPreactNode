import React from 'react';
import { CustomerDetails } from './models/CustomerFormModels';
import { Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers';
import { formatDate } from './models/commonFunctions';
import SelectWithLabel from '../../../../commonComponents/selectWithLabel/SelectWithLabel';

interface CustomerDetailsFormProps {
  formData: CustomerDetails;
  onChange: (fieldName: string, value: string) => void;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ formData, onChange }) => {
  const selectItems = [
    {
      value: 'Gift',
      label: 'Gift',
    },
    {
      value: 'Sambo',
      label: 'Sambo',
    },
    {
      value: 'Särbo',
      label: 'Särbo',
    },
    {
      value: 'Singel',
      label: 'Singel',
    },
  ];

  return (
    <Grid item sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <TextField
        label="Namn"
        value={formData.name}
        onChange={(e: any) => onChange('name', e.target.value)}
      />

      <DatePicker
        label={'Född'}
        views={['month', 'year']}
        onChange={(value, context: PickerChangeHandlerContext<DateValidationError>) =>
          onChange('yearMonth', formatDate(value as Date))
        }
      />

      <SelectWithLabel
        name={'status'}
        onChange={(e) => onChange('status', e)}
        items={selectItems}
        selectLabel={'Relationstatus'}
      />
    </Grid>
  );
};

export default CustomerDetailsForm;
