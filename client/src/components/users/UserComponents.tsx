import React, { useState, useEffect } from 'react';
import { Container, Drawer } from '@mui/material';
import CreateUserComponent from './CreateUserComponent';
import UserCredentialsComponent from './UserCredentialsComponent';
import { userState } from '../../services/state/RecoilAtoms';
import { useRecoilValue } from 'recoil';
import { getUserList } from '../../services/api/apiUserCalls';
import UserModel from './models/UserModel';
import UserListTable from './table/UserListTable';
import AddButton from '../ui/button/AddButton';
import { enqueueSnackbar } from 'notistack';

const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<Array<UserModel>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [changeOpen, setChangeOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { isAdmin } = useRecoilValue(userState);

  const handleCreateUserOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateUserClose = () => {
    setCreateOpen(false);
  };

  const handleUserPrefsOpen = (selectedUser: string) => {
    setChangeOpen(true);
    setSelectedUser(selectedUser);
  };

  const handleUserPrefsClose = () => {
    setChangeOpen(false);
  };

  const getUsers = async () => {
    setLoading(true);

    const response = await getUserList();
    if (response.success && response.status === 200) {
      setUsers(response.data!);
      setLoading(false);
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleUsers = () => {
    getUsers();
  };

  return (
    <Container component="main" maxWidth="md">
      {isAdmin && (
        <>
          <AddButton isLink={false} textInput={'Skapa användare'} onClick={handleCreateUserOpen} />

          <Drawer anchor="right" open={createOpen} onClose={handleCreateUserClose}>
            <CreateUserComponent onUserCreated={handleUsers} onClose={handleCreateUserClose} />
          </Drawer>
        </>
      )}

      {isAdmin && changeOpen && (
        <>
          <Drawer anchor="top" open={changeOpen} onClose={handleUserPrefsClose}>
            <UserCredentialsComponent
              onUserChanged={handleUsers}
              onClose={handleUserPrefsClose}
              _id={selectedUser || ''}
            />
          </Drawer>
        </>
      )}

      <UserListTable
        users={users}
        loading={loading}
        setUsers={setUsers}
        handleUserPrefsOpen={handleUserPrefsOpen}
      />
    </Container>
  );
};

export default UserComponent;
