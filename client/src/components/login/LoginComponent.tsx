import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  InputLabel,
  TextField,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { snackbarState, userState } from '../../services/state/RecoilAtoms';
import { loginAPI } from '../../services/api/apiUserCalls';
import { SubmitHandler, useForm } from 'react-hook-form';

type LoginForm = {
  email: string;
  password: string;
};

const LoginComponent: React.FC = () => {
  const setUser = useSetRecoilState(userState);
  const setSnackbarState = useSetRecoilState(snackbarState);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const response = await loginAPI(data.email, data.password);
    if (response.success && response.status === 200) {
      setSnackbarState({
        open: response.success,
        message: `Välkommen, ${response.data?.name || 'inloggning lyckades'}.`,
        severity: 'success',
      });

      localStorage.setItem('TOKEN', response.data!.token);
      localStorage.setItem('USERNAME', response.data!.name);

      setUser({
        loggedIn: true,
        isAdmin: response.data!.isAdmin,
        userId: response.data!.userId,
      });

      if (navigate) navigate('/');
    } else {
      setSnackbarState({
        open: true,
        message: response.error!,
        severity: 'error',
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
        }}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
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
        </Card>
      </Box>
    </Container>
  );
};

export default LoginComponent;
