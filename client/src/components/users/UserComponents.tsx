import React, { useState, useEffect } from 'react';
import { Container, Drawer } from '@mui/material';
import CreateUserComponent from './userHandlers/CreateUserComponent';
import UserCredentialsComponent from './userHandlers/UserCredentialsComponent';
import { snackbarState, userState } from '../../recoil/RecoilAtoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getUserList } from '../../apiCalls/apiUserCalls';
import UserModel from './models/UserModel';
import UserListTable from './userTable/UserListTable';
import AddButton from '../../commonComponents/button/AddButton';

const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<Array<UserModel>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [changeOpen, setChangeOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const setSnackbarState = useSetRecoilState(snackbarState);

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
      setSnackbarState({
        open: true,
        message: response.error!,
        severity: 'error',
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
