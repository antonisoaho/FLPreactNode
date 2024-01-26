export interface CustomFormProps {
  submitted?: () => void;
  formCount: number;
  setFormCount: React.Dispatch<React.SetStateAction<number>>;
}
