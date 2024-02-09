import { CardContent, Container } from '@mui/material';
import React from 'react';
import CredentialsForm from './forms/CredentialsForm';

export interface UserCredentialsProps {
  onClose: () => void;
  _id: string;
}

const UserCredentialsComponent: React.FC<UserCredentialsProps> = ({ onClose, _id }) => {
  return (
    <Container>
      <CardContent
        sx={{
          height: 340,
          width: '100%',
          display: 'flex',
        }}>
        <CredentialsForm onClose={onClose} _id={_id} />
      </CardContent>
    </Container>
  );
};

export default UserCredentialsComponent;
