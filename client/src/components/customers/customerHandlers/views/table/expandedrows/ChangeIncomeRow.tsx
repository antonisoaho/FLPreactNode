import { TableCell, Collapse, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../apiCalls/models/ApiModel';
import { IncomeChange } from '../../../edit/forms/models/CustomerFormModels';

interface RowProps {
  fields: [IncomeChange & DateFields];
}

const ChangeIncomeRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Collapse in={true} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Table size="small" aria-label="more-info">
              {fields!.map((inc) => (
                <React.Fragment key={inc._id}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{inc.belongs}</TableCell>
                      <TableCell />
                      <TableCell />

                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inc.updatedAt!).toLocaleDateString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell />
                      <TableCell>Typ av ändring</TableCell>
                      <TableCell>När</TableCell>
                      <TableCell>Nytt belopp</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                      <TableCell>{inc.values!.changeType}</TableCell>
                      <TableCell>{inc.values!.when?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inc.values!.newAmount?.toLocaleString() || '-'}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))}
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
