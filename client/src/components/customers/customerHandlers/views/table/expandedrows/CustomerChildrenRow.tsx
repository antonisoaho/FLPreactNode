import { TableCell, Collapse, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../apiCalls/models/ApiModel';
import { CustomerChildren } from '../../../edit/forms/models/CustomerFormModels';

interface RowProps {
  fields: [CustomerChildren & DateFields];
}

const CustomerChildrenRow: React.FC<RowProps> = ({ fields }) => {
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
                  <TableCell>Tillhör</TableCell>
                  <TableCell>Barnbidrag räknas</TableCell>
                  <TableCell>Född</TableCell>
                  <TableCell>Bor hemma till</TableCell>
                  <TableCell align="right">Uppdaterad</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {fields!.map((child) => (
                  <TableRow key={child._id}>
                    <TableCell />
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.belongs || '-'}</TableCell>
                    <TableCell>{child.childSupportCounts ? 'Ja' : 'Nej'}</TableCell>
                    <TableCell>{child.yearMonth}</TableCell>
                    <TableCell>{child.livesAtHomeToAge}</TableCell>
                    <TableCell align="right">
                      {new Date(child.updatedAt!).toLocaleDateString()}
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

export default CustomerChildrenRow;
