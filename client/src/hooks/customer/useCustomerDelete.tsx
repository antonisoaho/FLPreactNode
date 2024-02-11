import { useMutation, useQueryClient } from 'react-query';
import { deleteCustomerById } from '../../services/api/apiCustomerCalls';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export const useCustomerDelete = (custId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: customerDelete } = useMutation({
    mutationFn: () => deleteCustomerById(custId!),
    onSuccess: () => {
      enqueueSnackbar('Kund raderad', {
        variant: 'success',
      });
      navigate('/customers');
      queryClient.invalidateQueries('customers');
    },
    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  return customerDelete;
};
