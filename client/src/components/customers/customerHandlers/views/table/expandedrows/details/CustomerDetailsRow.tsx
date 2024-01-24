import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerDetails } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [CustomerDetails & DateFields];
}

const CustomerDetailsRow: React.FC<RowProps> = ({ fields }) => {
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
            </TableBody>
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default CustomerDetailsRow;
