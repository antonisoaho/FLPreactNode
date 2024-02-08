// Row.tsx
import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Tooltip,
  Fab,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import UserModel from '../models/UserModel';
import { getSingleUserById } from '../../../services/api/apiUserCalls';
import { enqueueSnackbar } from 'notistack';

interface RowProps {
  row: UserModel;
  setUsers: React.Dispatch<React.SetStateAction<UserModel[]>>;
  onUserPrefsOpen: (selectedUser: string) => void;
}
const Row: React.FC<RowProps> = ({ row, onUserPrefsOpen, setUsers }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    if (!open && !row.email) {
      const response = await getSingleUserById(row._id);

      if (response.success && response.status === 200) {
        const user = response.data;
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          const objIndex = updatedUsers.findIndex((obj) => obj._id === row._id);
          updatedUsers[objIndex].email = user!.email;
          updatedUsers[objIndex].updatedAt = user!.updatedAt;
          updatedUsers[objIndex].createdAt = user!.createdAt;
          return updatedUsers;
        });
      } else {
        enqueueSnackbar(response.error!, {
          variant: 'error',
        });
      }
    }
    setOpen(!open);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell
          style={{
            width: 'fit-content',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
            padding: 0,
            paddingLeft: '16px',
          }}>
          <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.isAdmin ? 'Ansvarig' : 'Rådgivare'}</TableCell>
        <TableCell />
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="more-info">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Mail</TableCell>
                    <TableCell>Uppdaterad</TableCell>
                    <TableCell>Skapad</TableCell>
                    <TableCell>
                      <Tooltip title="Redigera användare" placement="right" arrow>
                        <Fab
                          size="small"
                          aria-label="edit"
                          onClick={() => onUserPrefsOpen(row._id)}>
                          <EditIcon />
                        </Fab>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row._id}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{new Date(row.updatedAt!).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(row.createdAt!).toLocaleDateString()}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
