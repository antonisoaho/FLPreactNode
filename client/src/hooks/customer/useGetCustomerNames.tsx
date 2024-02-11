import { useState } from 'react';
import { useQuery } from 'react-query';
import { getCustomerNames } from '../../services/api/apiCustomerCalls'; // Assuming you have an API file with the getCustomerNames function
import { enqueueSnackbar } from 'notistack';

export const useGetCustomerNames = (custId: string) => {
  const [persons, setPersons] = useState<string[]>();

  const { isLoading } = useQuery({
    queryKey: ['customerDetails', custId],
    queryFn: () => getCustomerNames(custId),
    onSuccess: (data: string[]) => {
      setPersons(data.map((name) => name));
    },
    onError: () => {
      enqueueSnackbar('Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.', {
        variant: 'error',
      });
    },
  });

  return { persons, isLoading };
};
