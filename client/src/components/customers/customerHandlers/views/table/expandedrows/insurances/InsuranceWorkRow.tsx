import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { InsuranceWork } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [InsuranceWork & DateFields];
}

const InsuranceWorkRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((f) => (
              <React.Fragment key={f._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>Tillhör</TableCell>
                    <TableCell>Försäkringstyp</TableCell>
                    <TableCell align="right">Uppdaterad</TableCell>
                  </ColoredTableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.belongs || '-'}</TableCell>
                    <TableCell>{f.insuranceType || '-'}</TableCell>
                    <TableCell align="right">
                      {new Date(f.updatedAt!).toLocaleDateString()}
                    </TableCell>
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

export default InsuranceWorkRow;
