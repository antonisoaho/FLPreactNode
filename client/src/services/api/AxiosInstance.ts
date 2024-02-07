import axios, { AxiosError } from 'axios';
import globalRouter from '../../globalRouter';

export interface ExtendedError extends AxiosError {
  showSnackbar?: boolean;
  snackbarMessage?: string;
  snackbarType?: string;
}

const loc = window.location;
const baseURL =
  loc.hostname === 'localhost' ? 'http://localhost:3001' : 'https://golife-backend.onrender.com/';

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
    if (err.response) {
      if (err.response.status === 401 && globalRouter.navigate) {
        globalRouter.navigate('/login');
        Logout();
      } else if (err.response.status === 403 && globalRouter.navigate) {
        globalRouter.navigate(history.length - 2);
      } else if (err.response.status === 404 && globalRouter.navigate) {
        globalRouter.navigate('/404');
      }

      const errorWithSnackbarInfo: ExtendedError = {
        ...err,
        showSnackbar: true,
        snackbarMessage: err.message || 'Ett fel inträffade.',
        snackbarType: 'error',
      };

      return Promise.reject(errorWithSnackbarInfo);
    }
  }
);

export const Logout = () => {
  localStorage.removeItem('TOKEN');
  localStorage.removeItem('USERNAME');

  delete axiosInstance.defaults.headers['Authorization'];
};

export default axiosInstance;
