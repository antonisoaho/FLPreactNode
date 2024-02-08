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
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

dayjs.locale('sv');
const queryClient = new QueryClient();

const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SnackbarProvider maxSnack={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
            </SnackbarProvider>
          </ThemeProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default Providers;
