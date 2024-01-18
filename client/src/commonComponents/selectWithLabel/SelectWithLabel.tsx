import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface SelectWithLabelProps {
  name: string;
  onChange: (
    name: string,
    value: string | number,
    event: SelectChangeEvent<string | number>
  ) => void;
  items: { value: string; label: string }[];
  selectLabel: string;
}

const SelectWithLabel: React.FC<SelectWithLabelProps> = ({
  name,
  onChange,
  items,
  selectLabel,
}) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    onChange(name, value, event);
  };

  return (
    <FormControl>
      <InputLabel id={`${name}-label`}>{selectLabel}</InputLabel>
      <Select
        sx={{ minWidth: '180px', textAlign: 'left' }}
        label={selectLabel}
        labelId={`${name}-label`}
        value={selectedValue}
        onChange={handleSelectChange}
        name={name}>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectWithLabel;
