import axiosInstance, { ExtendedError } from '../axios/AxiosInstance';
import { ApiResponse, ErrorResponse } from './models/ApiModel';
import LoginResponse from '../components/login/models/LoginResponse';
import UserModel from '../components/users/models/UserModel';
import UpdateUserModel from '../components/users/userHandlers/models/UpdateUserModel';
import CreateUserModel from '../components/users/userHandlers/models/CreateUserModel';

export const loginAPI = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/login', {
      email: email,
      password: password,
    });
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else throw new Error('Ett oväntat fel inträffade, försök igen senare.');
  } catch (error) {
    const extendedError = error as ExtendedError;
    const errorMessage: ErrorResponse = <ErrorResponse>extendedError.response?.data;

    return {
      success: false,
      status: extendedError.status,
      error: errorMessage.error || 'Ett oväntat fel inträffade, försök igen senare.',
    };
  }
};

export const getUserList = async (): Promise<ApiResponse<UserModel[]>> => {
  try {
    const response = await axiosInstance.get('/users');
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else throw new Error('Ett oväntat fel inträffade, försök igen senare.');
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

export const getSingleUserById = async (id: string): Promise<ApiResponse<UserModel>> => {
  try {
    const response = await axiosInstance.get(`/users/singleuser/${id}`);
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

export const updateSingleUserById = async (id: string, newData: UpdateUserModel) => {
  try {
    const response = await axiosInstance.patch<UpdateUserModel>(`users/singleuser/${id}`, {
      newData,
    });

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

export const createNewUser = async ({
  name = '',
  email = '',
  password = '',
  isAdmin = false,
}: CreateUserModel): Promise<ApiResponse<CreateUserModel>> => {
  try {
    const response = await axiosInstance.post<CreateUserModel>('/users/createuser', {
      name,
      email,
      password,
      isAdmin,
    });

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

export const deleteUserById = async (id: string): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.delete(`/users/singleuser/${id}`);

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
      error: errorMessage.error || 'Ett oväntat fel inträffade vid radering av användare.',
    };
  }
};

export const userInfoGetMe = async (): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axiosInstance.get(`/users/getme`);

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
      error: errorMessage.error || 'Ett oväntat fel inträffade vid radering av användare.',
    };
  }
};
