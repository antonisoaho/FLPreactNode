import { enqueueSnackbar } from 'notistack';
import { LiabilityBase } from '../../components/customers/models/CustomerFormModels';
import { getCustomerFormData } from '../../services/api/apiCustomerCalls';
import { DateFields } from '../../services/api/models';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const useGetCustomerBaseLiabilityLabels = (custId: string, prevArray: any[]) => {
  const [selectItems, setSelectItems] = useState(prevArray);

  const { isLoading } = useQuery({
    queryKey: ['liabilities', custId],
    queryFn: () =>
      getCustomerFormData({ field: 'liabilities', subField: 'base', custId: custId as string }),

    onSuccess: (data: [LiabilityBase & DateFields]) => {
      setSelectItems((prev) => {
        const currentValues = prev.map((item) => item.value);
        const newLoans = data
          .filter((loan) => !currentValues.includes(loan._id))
          .map((loan) => ({
            value: loan._id,
            label: `${loan.name} - ${loan.debt!.toLocaleString()} kr: ${loan._id}`,
          }));

        return [...prev, ...newLoans];
      });
    },
    onError: () => {
      enqueueSnackbar(
        'Kunde inte hitta några befintliga lån att planera kring, vänligen lägg till ett nytt lån.',
        {
          variant: 'error',
        }
      );
    },
  });

  return { isLoading, selectItems };
};
