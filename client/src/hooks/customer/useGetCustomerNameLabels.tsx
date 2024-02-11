import { useState } from 'react';
import { useQuery } from 'react-query';
import { getCustomerNames } from '../../services/api/apiCustomerCalls'; // Assuming you have an API file with the getCustomerNames function
import { enqueueSnackbar } from 'notistack';

export const useGetCustomerNameLabels = (custId: string, prevArray: any[]) => {
  const [selectItems, setSelectItems] = useState(prevArray);

  useQuery({
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

  return selectItems;
};
