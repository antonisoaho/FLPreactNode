import { FC } from 'react';
import { ProviderProps } from './ProviderProps';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';

dayjs.locale('sv');

const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <ThemeProvider>
          <SnackbarProvider maxSnack={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default Providers;
