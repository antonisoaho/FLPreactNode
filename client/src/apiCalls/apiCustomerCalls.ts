import axiosInstance, { ExtendedError } from '../axios/AxiosInstance';
import { CustomerOverview } from '../components/customers/customerHandlers/views/models/ViewCustomerModel';
import CustomerModel from '../components/customers/models/CustomerModel';
import {
  ApiResponse,
  CustomerDataHandler,
  CustomerFormResponse,
  CustomerGetDataHandler,
  ErrorResponse,
  SubDocRemoval,
} from './models/ApiModel';

export const getCustomerList = async (): Promise<ApiResponse<CustomerModel[]>> => {
  try {
    const response = await axiosInstance.get('/customers');
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};

export const getSingleCustomerById = async (
  custId: string
): Promise<ApiResponse<CustomerOverview>> => {
  try {
    const response = await axiosInstance.get(`/customers/${custId}`);
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;
    if (extendedError.status === 403) {
      return {
        success: false,
        status: extendedError.status,
        error: errorMessage.error || 'Ett oväntat fel inträffade.',
      };
    } else {
      return {
        success: false,
        status: extendedError.status,
        error: errorMessage.error || 'Ett oväntat fel inträffade.',
      };
    }
  }
};

export const getCustomerNames = async (id: string): Promise<ApiResponse<[]>> => {
  try {
    const response = await axiosInstance.get(`/customers/${id}/customerDetails`);

    const customerNames = response.data.map((cust: { name: string }) => cust.name);

    return {
      success: true,
      status: response.status,
      data: customerNames,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};

export const createNewCustomer = async (): Promise<ApiResponse<CustomerModel>> => {
  try {
    const response = await axiosInstance.post('/customers/create');

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};

export const getCustomerFormData = async (
  details: CustomerGetDataHandler
): Promise<ApiResponse<CustomerFormResponse>> => {
  if (details.subField == undefined) {
    details.subField = '';
  }
  try {
    const response = await axiosInstance.get(
      `/customers/${details._id}/${details.field}/${details.subField}`
    );

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};

export const updateCustomer = async (
  details: CustomerDataHandler
): Promise<ApiResponse<CustomerFormResponse>> => {
  if (details.subField == undefined) {
    details.subField = '';
  }
  try {
    const response = await axiosInstance.patch(
      `/customers/${details._id}/update/${details.field}/${details.subField}`,
      details.formData
    );

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};

export const deleteCustomerById = async (custId: string): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.delete(`/customers/${custId}`);
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};

export const deleteCustSubDocument = async (
  d: SubDocRemoval
): Promise<ApiResponse<CustomerFormResponse>> => {
  if (d.subField == undefined) {
    d.subField = '';
  }
  try {
    const response = await axiosInstance.patch(
      `/customers/${d.custId}/remove/${d.field}/${d.subDocId}/${d.subField}`
    );
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade.',
    };
  }
};
