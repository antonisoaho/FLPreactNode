import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { ExpensesChange } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [ExpensesChange & DateFields];
}

const ChangeIncomeRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            <TableHead>
              <ColoredTableRow>
                <TableCell>Typ av ändring</TableCell>
                <TableCell>När</TableCell>
                <TableCell>Nytt belopp</TableCell>
                <TableCell>Pågår</TableCell>
                <TableCell>Kommentar</TableCell>
                <TableCell>Uppdaterad</TableCell>
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {fields!.map((exp) => (
                <React.Fragment key={exp._id}>
                  <TableRow>
                    <TableCell>{exp.values!.changeType || '-'}</TableCell>
                    <TableCell>{exp.values!.when?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{exp.values!.value || '-'}</TableCell>
                    <TableCell>{exp.values!.ongoing?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{exp.values!.comment || '-'}</TableCell>
                    <TableCell>{exp.updatedAt?.toLocaleDateString()}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
