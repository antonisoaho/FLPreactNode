import { TextFieldProps } from '@mui/material';
import { DatePickerProps } from '@mui/x-date-pickers';

export const FormTextFieldProps: TextFieldProps = {
  size: 'small',
  variant: 'standard',
  className: 'form-input-field',
};

export const FormPercentageProps: TextFieldProps = {
  ...FormTextFieldProps,
  type: 'number',
  inputProps: { step: 0.01 },
  placeholder: 'Ange procent',
};

export const FormNumberFieldProps: TextFieldProps = {
  ...FormTextFieldProps,
  type: 'number',
  placeholder: 'Ange summa',
};

export const FormSelectProps: TextFieldProps = {
  variant: 'standard',
  size: 'small',
  fullWidth: true,
  select: true,
  defaultValue: '',
  className: 'form-input-select',
};

export const FormDateProps: DatePickerProps<Date> = {
  slotProps: { textField: { ...FormTextFieldProps } },
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
