import { useMutation, useQueryClient } from 'react-query';
import { enqueueSnackbar } from 'notistack';
import { deleteUserById } from '../../services/api/apiUserCalls';

export const useUserDelete = (id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: userDelete } = useMutation({
    mutationFn: () => deleteUserById(id),
    onSuccess: () => {
      enqueueSnackbar('Användare raderad.', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['users', 'userLoggedIn']);
    },

    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  return userDelete;
};
