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
import { useMutation } from 'react-query';
import TableLoader from '../../ui/tableLoader/TableLoader';

interface RowProps {
  row: UserModel;
  onUserPrefsOpen: (selectedUser: string) => void;
}
const Row: React.FC<RowProps> = ({ row, onUserPrefsOpen }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (_id: string) => {
    setOpen(true);
    getUser(_id);
  };

  const {
    data: user,
    mutateAsync: getUser,
    isLoading,
  } = useMutation({
    mutationFn: (id: string) => getSingleUserById(id),

    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

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
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => (!open ? handleOpen(row._id) : setOpen(false))}>
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
              <Table size="small">
                {isLoading ? (
                  <TableHead>
                    <TableLoader colSpan={5} />
                  </TableHead>
                ) : (
                  <>
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
                    {user && (
                      <TableBody>
                        <TableRow>
                          <TableCell>{user._id}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.updatedAt!).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(user.createdAt!).toLocaleDateString()}</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    )}
                  </>
                )}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
