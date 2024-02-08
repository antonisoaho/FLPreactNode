import { Box, Card, CardContent, Container, IconButton } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CreateUserForm from './forms/CreateUserForm';

interface CreateUserComponentProps {
  onClose: () => void;
}

const CreateUserComponent: React.FC<CreateUserComponentProps> = ({ onClose }) => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ padding: 0, paddingRight: 0, paddingLeft: 0 }}>
      <Box>
        <Card>
          <CardContent
            sx={{
              height: '100vh',
              width: 330,
              paddingTop: 8,
            }}>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 10,
                top: 10,
              }}>
              <CloseIcon />
            </IconButton>
            <CreateUserForm onClose={onClose} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CreateUserComponent;
