import { CustomerFormData } from '../../components/customers/customerHandlers/views/forms/models/CustomerFormModels';

export type ApiResponse<T> = {
  success: boolean;
  status: number | undefined;
  data?: T;
  error?: string;
};

export type ErrorResponse = {
  error?: string;
};

export type CustomerDataHandler = {
  field: string;
  subField?: string;
  _id: string;
  formData: CustomerFormData[];
};

export type DateFields = {
  createdAt: Date;
  updatedAt: Date;
  _id: string;
};

export type CustomerFormResponse = CustomerFormData & DateFields;
