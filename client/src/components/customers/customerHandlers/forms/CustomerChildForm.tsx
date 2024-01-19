import React from 'react';
import { CustomerChildren } from './models/CustomerFormModels';
import { Checkbox, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import SelectWithLabel from '../../../../commonComponents/selectWithLabel/SelectWithLabel';
import { formatDate } from './models/commonFunctions';

interface CustomerChildFormProps {
  formData?: CustomerChildren;
  onChange?: (fieldName: string, value: string | number | boolean) => void;
}

const CustomerChildForm: React.FC<CustomerChildFormProps> = ({ formData, onChange }) => {
  const selectItems = [
    {
      value: 'Knut',
      label: 'Knut',
    },
    {
      value: 'Greta',
      label: 'Greta',
    },
    { value: 'Gemensamt', label: 'Gemensamt' },
  ];

  return (
    <Grid item sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <TextField
        label="Namn"
        value={formData!.name}
        onChange={(e: any) => onChange!('name', e.target.value)}
      />

      <DatePicker
        label={'Född'}
        views={['month', 'year']}
        onChange={(value) => onChange!('yearMonth', formatDate(value as Date))}
      />

      <SelectWithLabel
        name={'belongs'}
        onChange={(e) => onChange!('belongs', e)}
        items={selectItems}
        selectLabel={'Tillhör'}
      />

      <Checkbox
        value={formData!.childSupportCounts}
        onChange={(e) => onChange!('childSupportCounts', e.target.checked)}></Checkbox>
    </Grid>
  );
};

export default CustomerChildForm;
