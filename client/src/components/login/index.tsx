import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import LoginForm from './LoginForm';
import { useRecoilValue } from 'recoil';
import { userState } from '../../services/state/RecoilAtoms';

const LoginComponent = () => {
  const { loggedIn } = useRecoilValue(userState);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 12 }}>
        <Card>
          {loggedIn ? (
            <CardContent>
              <Typography variant="h5" p={3}>
                Du är redan inloggad.
              </Typography>
              <Button variant="contained" href={'/'}>
                Klicka för att gå till startsida
              </Button>
            </CardContent>
          ) : (
            <LoginForm />
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default LoginComponent;
