import axiosInstance from './AxiosInstance';
import { LoginResponse } from '../../components/login/models';
import UserModel from '../../components/users/models/UserModel';
import UpdateUserModel from '../../components/users/models/UpdateUserModel';
import CreateUserModel from '../../components/users/models/CreateUserModel';

export const loginAPI = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/login', {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserList = async (): Promise<UserModel[]> => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSingleUserById = async (id: string): Promise<UserModel> => {
  try {
    const response = await axiosInstance.get(`/users/singleuser/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateSingleUserById = async (id: string, newData: UpdateUserModel) => {
  try {
    const response = await axiosInstance.patch<UpdateUserModel>(`users/singleuser/${id}`, {
      newData,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createNewUser = async ({
  name = '',
  email = '',
  password = '',
  isAdmin = false,
}: CreateUserModel): Promise<CreateUserModel> => {
  try {
    const response = await axiosInstance.post<CreateUserModel>('/users/createuser', {
      name,
      email,
      password,
      isAdmin,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteUserById = async (id: string): Promise<string> => {
  try {
    const response = await axiosInstance.delete(`/users/singleuser/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const userInfoGetMe = async (): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.get(`/users/getme`);
    return response.data;
  } catch (error) {
    return Promise.reject('Ej inloggad');
  }
};
