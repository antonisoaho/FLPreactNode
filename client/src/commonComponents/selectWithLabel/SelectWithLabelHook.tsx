import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';

interface SelectWithLabelProps {
  name: string;
  items: { value: string; label: string }[];
  selectLabel: string;
}

const SelectWithLabelHook: React.FC<SelectWithLabelProps> = ({ name, items, selectLabel }) => {
  const { register, setValue } = useForm();

  const handleValueChange = (newValue: any) => {
    console.log('newValue', newValue);
    setValue(name, newValue);
  };

  return (
    <FormControl>
      <InputLabel id={`${name}-label`}>{selectLabel}</InputLabel>
      <Select
        sx={{ minWidth: '180px', textAlign: 'left' }}
        label={selectLabel}
        labelId={`${name}-label`}
        defaultValue=""
        {...register(name)}
        name={name}
        onChange={(value) => handleValueChange(value.target.value)}>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectWithLabelHook;
