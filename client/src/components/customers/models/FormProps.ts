import { SelectProps, TextFieldProps } from '@mui/material';

export const FormTextFieldProps: TextFieldProps = {
  size: 'small',
  variant: 'standard',
};

export const FormSelectProps: SelectProps = {
  variant: 'standard',
  size: 'small',
};

export type FormFields = {
  field: string;
  custId: string;
  subField?: string;
};

export interface CustomFormProps {
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formFields: FormFields;
}
