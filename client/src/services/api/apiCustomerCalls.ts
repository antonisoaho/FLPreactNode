import axiosInstance from './AxiosInstance';
import { CustomerOverview } from '../../components/customers/models/ViewCustomerModel';
import CustomerModel from '../../components/customers/models/CustomerModel';
import {
  CustomerDataHandler,
  CustomerFormResponse,
  CustomerGetDataHandler,
  SubDocRemoval,
} from './models';

export const getCustomerList = async (): Promise<CustomerModel[]> => {
  try {
    const response = await axiosInstance.get('/customers');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSingleCustomerById = async (custId: string): Promise<CustomerOverview> => {
  try {
    const response = await axiosInstance.get(`/customers/${custId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerNames = async (id: string): Promise<[]> => {
  try {
    const response = await axiosInstance.get(`/customers/${id}/customerDetails`);
    const customerNames = response.data.map((cust: { name: string }) => cust.name);
    return customerNames;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerChildNames = async (id: string): Promise<[]> => {
  try {
    const response = await axiosInstance.get(`/customers/${id}/customerChildren`);
    const customerNames = response.data.map((cust: { name: string }) => cust.name);
    return customerNames;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createNewCustomer = async (): Promise<CustomerModel> => {
  try {
    const response = await axiosInstance.post('/customers/create');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerFormData = async (
  details: CustomerGetDataHandler
): Promise<CustomerFormResponse> => {
  if (details.subField == undefined) {
    details.subField = '';
  }
  try {
    const response = await axiosInstance.get(
      `/customers/${details._id}/${details.field}/${details.subField}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateCustomer = async (
  details: CustomerDataHandler
): Promise<CustomerFormResponse> => {
  if (details.subField == undefined) {
    details.subField = '';
  }
  try {
    const response = await axiosInstance.patch(
      `/customers/${details._id}/update/${details.field}/${details.subField}`,
      details.formData
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteCustomerById = async (custId: string): Promise<string> => {
  try {
    const response = await axiosInstance.delete(`/customers/${custId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteCustSubDocument = async (d: SubDocRemoval): Promise<CustomerFormResponse> => {
  if (d.subField == undefined) {
    d.subField = '';
  }
  try {
    const response = await axiosInstance.patch(
      `/customers/${d.custId}/remove/${d.field}/${d.subDocId}/${d.subField}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
