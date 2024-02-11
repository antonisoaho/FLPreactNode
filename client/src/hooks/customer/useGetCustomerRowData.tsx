import { enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { CustomerFormData } from '../../components/customers/models/CustomerFormModels';
import { FormFields } from '../../components/customers/models/FormProps';
import { getCustomerFormData } from '../../services/api/apiCustomerCalls';
import { DateFields } from '../../services/api/models';

export const useGetCustomerRowData = (formFields: FormFields) => {
  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [CustomerFormData & DateFields];
    },

    cacheTime: 0,
    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  return { data, isLoading };
};
