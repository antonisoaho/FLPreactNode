import { Box, Card, Container } from '@mui/material';
import LoginForm from './LoginForm';

const LoginComponent = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
        }}>
        <Card>
          <LoginForm />
        </Card>
      </Box>
    </Container>
  );
};

export default LoginComponent;
