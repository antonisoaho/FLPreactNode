import React, { useState } from 'react';
import { Container, Drawer } from '@mui/material';
import CreateUserComponent from './CreateUserComponent';
import UserCredentialsComponent from './UserCredentialsComponent';
import { userState } from '../../services/state/RecoilAtoms';
import { useRecoilValue } from 'recoil';
import { getUserList } from '../../services/api/apiUserCalls';
import UserModel from './models/UserModel';
import UserListTable from './table/UserListTable';
import AddButton from '../ui/button/AddButton';
import { useQuery } from 'react-query';

const UserComponent: React.FC = () => {
  // const [users, setUsers] = useState<Array<UserModel>>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [changeOpen, setChangeOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { isAdmin } = useRecoilValue(userState);

  const handleCreateUser = () => {
    setCreateOpen(!open);
  };

  const handleUserPrefsOpen = (selectedUser: string) => {
    setChangeOpen(true);
    setSelectedUser(selectedUser);
  };

  const handleUserPrefsClose = () => {
    setChangeOpen(false);
  };

  const { data: users, isLoading } = useQuery({
    queryFn: () => getUserList(),
    queryKey: ['users'],
  });

  return (
    <Container component="main" maxWidth="md">
      {isAdmin && (
        <>
          <AddButton isLink={false} textInput={'Skapa användare'} onClick={handleCreateUser} />

          <Drawer anchor="right" open={createOpen} onClose={handleCreateUser}>
            <CreateUserComponent onClose={handleCreateUser} />
          </Drawer>
        </>
      )}

      {isAdmin && changeOpen && (
        <>
          <Drawer anchor="top" open={changeOpen} onClose={handleUserPrefsClose}>
            <UserCredentialsComponent onClose={handleUserPrefsClose} _id={selectedUser || ''} />
          </Drawer>
        </>
      )}

      <UserListTable
        users={(users as UserModel[]) || []}
        isLoading={isLoading}
        handleUserPrefsOpen={handleUserPrefsOpen}
      />
    </Container>
  );
};

export default UserComponent;
