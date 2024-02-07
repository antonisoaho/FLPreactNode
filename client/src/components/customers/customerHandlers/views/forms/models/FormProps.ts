import { SelectProps, TextFieldProps } from '@mui/material';

export interface CustomFormProps {
  submitted?: () => void;
  formCount: number;
  setFormCount: React.Dispatch<React.SetStateAction<number>>;
}

export const FormTextFieldProps: TextFieldProps = {
  size: 'small',
  variant: 'standard',
};

export const FormSelectProps: SelectProps = {
  variant: 'standard',
  size: 'small',
};
