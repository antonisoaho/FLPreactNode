// UserListTable.tsx
import React from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import UserModel from '../models/UserModel';
import Row from './Row';

interface UserListTableProps {
  users: UserModel[];
  loading: boolean;
  setUsers: React.Dispatch<React.SetStateAction<UserModel[]>>;
  handleUserPrefsOpen: (selectedUser: string) => void;
}

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  loading,
  setUsers,
  handleUserPrefsOpen,
}) => {
  const loaderStyles = {
    minWidth: 650,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 6,
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 'fit-content', whiteSpace: 'nowrap', maxWidth: '20px' }} />
            <TableCell>Namn</TableCell>
            <TableCell>Roll</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} sx={loaderStyles}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <Row
                key={user._id}
                row={user}
                setUsers={setUsers}
                onUserPrefsOpen={handleUserPrefsOpen}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserListTable;
