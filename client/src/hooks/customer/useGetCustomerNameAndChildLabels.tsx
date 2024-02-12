import { useState } from 'react';
import { useQuery } from 'react-query';
import { getCustomerChildNames, getCustomerNames } from '../../services/api/apiCustomerCalls';
import { enqueueSnackbar } from 'notistack';

export const useGetCustomerNameAndChildLabels = (custId: string, prevArray: any[]) => {
  const [selectItems, setSelectItems] = useState(prevArray);

  const { isLoading } = useQuery({
    queryKey: ['customerDetails', custId],
    queryFn: () => getCustomerNames(custId),
    onSuccess: (data) => {
      setSelectItems((prev: any[]) => {
        const currentLabels = prev.map((item) => item.label);
        const newItems = data
          .filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newItems];
      });
    },
    onError: () => {
      enqueueSnackbar('Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.', {
        variant: 'error',
      });
    },
  });

  useQuery({
    queryKey: ['customerChildren', custId],
    queryFn: () => getCustomerChildNames(custId),

    onSuccess: (data) => {
      setSelectItems((prev: any[]) => {
        const currentLabels = prev.map((item) => item.label);
        const newItems = data
          .filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newItems];
      });
    },
  });

  return { selectItems, isLoading };
};
