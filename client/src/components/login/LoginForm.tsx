import { CardContent, TextField, InputLabel, CardActions, Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { loginAPI } from '../../services/api/apiUserCalls';
import { userState } from '../../services/state/RecoilAtoms';
import { LoginResponse, LoginFormData } from './models';

const LoginForm = () => {
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const { mutateAsync: onSubmit } = useMutation({
    mutationFn: (data: LoginFormData) => loginAPI(data.email, data.password),
    onSuccess: (data) => {
      const { userId, name, isAdmin, token } = data as LoginResponse;

      enqueueSnackbar(`Välkommen, ${name || 'inloggning lyckades'}.`, {
        variant: 'success',
      });

      setUser({
        loggedIn: true,
        isAdmin,
        userId,
      });

      localStorage.setItem('TOKEN', token);
      localStorage.setItem('USERNAME', name);

      navigate('/');
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit as SubmitHandler<LoginFormData>)}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        <TextField
          label="Email"
          variant="outlined"
          type="text"
          autoComplete="admin"
          {...register('email', { required: 'Email saknas.' })}
        />
        {errors.email && <InputLabel>{errors.email.message}</InputLabel>}
        <TextField
          label="Lösenord"
          variant="outlined"
          type="password"
          autoComplete="password"
          {...register('password', { required: 'Lösenord saknas.' })}
        />
        {errors.password && <InputLabel>{errors.password.message}</InputLabel>}
        <CardActions
          sx={{
            justifyContent: 'flex-end',
          }}>
          <Button disabled={isSubmitting} variant="contained" color="primary" type="submit">
            {isSubmitting ? 'Loggar in...' : 'Logga in'}
          </Button>
        </CardActions>
      </CardContent>
    </form>
  );
};

export default LoginForm;
