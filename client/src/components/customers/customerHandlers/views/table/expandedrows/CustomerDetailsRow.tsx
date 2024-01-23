import { TableCell, Collapse, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../apiCalls/models/ApiModel';
import { CustomerDetails } from '../../../edit/forms/models/CustomerFormModels';

interface RowProps {
  fields: [CustomerDetails & DateFields];
}

const CustomerDetailsRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Collapse in={true} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Table size="small" aria-label="more-info">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Namn</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Född</TableCell>
                  <TableCell align="right">Uppdaterad</TableCell>
                  <TableCell />
                </TableRow>
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
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default CustomerDetailsRow;
