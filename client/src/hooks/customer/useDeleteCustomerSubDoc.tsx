import { useMutation, useQueryClient } from 'react-query';
import { FormFields } from '../../components/customers/models/FormProps';
import { deleteCustSubDocument } from '../../services/api/apiCustomerCalls';

export const useDeleteCustomerSubDoc = (formFields: FormFields) => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeSubDoc } = useMutation({
    mutationFn: (subDocId: string) => deleteCustSubDocument({ ...formFields, subDocId }),

    onSuccess: () => {
      queryClient.invalidateQueries(['customer']);
    },
  });

  return removeSubDoc;
};
