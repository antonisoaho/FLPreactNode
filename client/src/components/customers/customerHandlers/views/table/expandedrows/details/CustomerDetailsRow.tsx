import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import React, { useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerDetails } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import CustomerDetailsForm from '../../../forms/CustomerDetailsForm';

interface RowProps {
  fields: [CustomerDetails & DateFields];
}

const CustomerDetailsRow: React.FC<RowProps> = ({ fields }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const onSubmit = () => {
    console.log('refreshData');
  };

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            <TableHead>
              <ColoredTableRow>
                <TableCell />
                <TableCell>Namn</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Född</TableCell>
                <TableCell align="right">Uppdaterad</TableCell>
                <TableCell />
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {fields!.map((person) => (
                <TableRow key={person._id}>
                  <TableCell />
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.status}</TableCell>
                  <TableCell>{person.yearMonth}</TableCell>
                  <TableCell align="right">
                    {new Date(person.updatedAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={6} align="right">
                  <ListItemButton onClick={() => setFormOpen(!formOpen)}>Lägg till</ListItemButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {formOpen && (
          <CustomerDetailsForm submitted={onSubmit} closeForm={() => setFormOpen(false)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CustomerDetailsRow;
