import { useSnackbar } from 'notistack';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../models';

type IUseSignIn = UseMutateFunction<LoginForm, unknown, { email: string, password: string }, unknown>;


export const useSignIn = (): IUseSignIn => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const { mutateAsync: signInMutation } = useMutation(<LoginForm, ({
        email,
        password
    }) => loginAPI(email, password), {
        onSuccess: (data: any) => {
            if (data.data.success && data.status === 200) {
                enqueueSnackbar(`Välkommen, ${data.data?.name || 'inloggning lyckades'}.`, {
                    variant: 'success',
                });
                localStorage.setItem('TOKEN', data.data!.token);
                localStorage.setItem('USERNAME', data.data!.name);
                queryClient.invalidateQueries('loggedInUser');
                navigate('/');
            } else {
                enqueueSnackbar(data.error!, {
                    variant: 'error',
                });
            }
        },
    });

  return signInMutation
}