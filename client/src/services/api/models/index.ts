import { CustomerFormData } from '../../../components/customers/models/CustomerFormModels';

// export type ApiResponse<T> = {
//   data: T | string | undefined;
//   status: number | undefined;
// };

export type ApiResponse<T> = T | unknown;

export type QueryResponse<T> = {
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

export type CustomerGetDataHandler = {
  field: string;
  subField?: string;
  _id: string;
};

export type DateFields = {
  createdAt: Date;
  updatedAt: Date;
  _id: string;
};

export type SubDocRemoval = {
  field: string;
  custId: string;
  subDocId: string;
  subField?: string;
};

export type CustomerFormResponse = [CustomerFormData & DateFields];
