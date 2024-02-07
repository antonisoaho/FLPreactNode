// UserListTable.tsx
import React from 'react';
import {
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
import TableLoader from '../../customers/customerHandlers/views/table/TableLoader';

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
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }}>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                width: 'fit-content',
                whiteSpace: 'nowrap',
                maxWidth: '10px',
                padding: 0,
                paddingLeft: '16px',
              }}
            />
            <TableCell>Namn</TableCell>
            <TableCell colSpan={3}>Roll</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableLoader colSpan={5} />
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
