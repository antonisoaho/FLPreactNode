import { Box, Button, Card, CardActions, CardContent, Container, TextField } from '@mui/material';
import React, { useState, KeyboardEvent, FormEvent } from 'react';
import globalRouter from '../../globalRouter';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { snackbarState, userState } from '../../recoil/RecoilAtoms';
import { loginAPI } from '../../apiCalls/apiUserCalls';

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const setUser = useSetRecoilState(userState);
  const setSnackbarState = useSetRecoilState(snackbarState);

  const navigate = useNavigate();

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      Login();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Login();
  };

  const Login = async () => {
    const response = await loginAPI(email, password);
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
      navigate('/');

      if (globalRouter.navigate) globalRouter.navigate('/');
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
          <form onSubmit={handleSubmit}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}>
              <TextField
                id="loginEmail"
                label="Email"
                variant="outlined"
                autoComplete="admin"
                type="text"
                required
                onChange={(event) => setEmail(event.target.value)}></TextField>
              <TextField
                id="loginPassword"
                label="Lösenord"
                variant="outlined"
                type="password"
                autoComplete="current-password"
                required
                onKeyPress={handleKeyPress}
                onChange={(event) => setPassword(event.target.value)}></TextField>
              <CardActions
                sx={{
                  justifyContent: 'flex-end',
                }}>
                <Button variant="contained" color="primary" type="submit">
                  Logga in
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
