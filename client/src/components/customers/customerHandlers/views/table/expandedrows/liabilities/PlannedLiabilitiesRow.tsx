import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { LiabilityPlanned } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [LiabilityPlanned & DateFields];
}

const PlannedLiabilitesRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((f) => (
              <React.Fragment key={f._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>Lån</TableCell>
                    <TableCell>Händelse</TableCell>
                    <TableCell>När (ant. år)</TableCell>
                    <TableCell>Belopp</TableCell>
                    <TableCell>Ränta</TableCell>
                    <TableCell align="right">Uppdaterad</TableCell>
                  </ColoredTableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.loanType || 'Ospecificerat'}</TableCell>
                    <TableCell>{f.event || '-'}</TableCell>
                    <TableCell>{f.when || '-'}</TableCell>
                    <TableCell>{f.amount || '-'}</TableCell>
                    <TableCell>{f.interest || '-'}</TableCell>
                    <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </React.Fragment>
            ))}
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default PlannedLiabilitesRow;
