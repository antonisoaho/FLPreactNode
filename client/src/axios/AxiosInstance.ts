import axios, { AxiosError } from 'axios';
import globalRouter from '../../src/globalRouter';

export interface ExtendedError extends AxiosError {
  showSnackbar?: boolean;
  snackbarMessage?: string;
  snackbarType?: string;
}

const baseURL = 'http://localhost:3001/';

const axiosInstance = axios.create({
  baseURL,
  headers: { Authorization: localStorage.getItem('TOKEN') },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem('TOKEN');
    return config;
  },
  (err: ExtendedError) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err: ExtendedError) => {
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403) &&
      globalRouter.navigate
    ) {
      globalRouter.navigate('/login');
      Logout();
    }

    const errorWithSnackbarInfo: ExtendedError = {
      ...err,
      showSnackbar: true,
      snackbarMessage: err.message || 'Ett fel inträffade.',
      snackbarType: 'error',
    };

    return Promise.reject(errorWithSnackbarInfo);
  }
);

export const Logout = () => {
  localStorage.removeItem('TOKEN');
  localStorage.removeItem('USERNAME');

  delete axiosInstance.defaults.headers['Authorization'];
};

export default axiosInstance;
