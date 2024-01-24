import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { InsuranceProperty } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [InsuranceProperty & DateFields];
}

const InsurancePropertyRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((f) => (
              <React.Fragment key={f._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>Försäkringstyp</TableCell>
                    <TableCell>Bolag</TableCell>
                    <TableCell>Förfallodag</TableCell>
                    <TableCell>Premie</TableCell>
                    <TableCell>Betalning</TableCell>
                    <TableCell>Senast kontroll</TableCell>
                    <TableCell align="right">Uppdaterad</TableCell>
                  </ColoredTableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.propertyType || '-'}</TableCell>
                    <TableCell>{f.company || '-'}</TableCell>
                    <TableCell>{new Date(f.expiryDate!).toLocaleDateString() || '-'}</TableCell>
                    <TableCell>{f.premiumCost?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.paymentPeriod || '-'}</TableCell>
                    <TableCell>{f.lastControl || '-'}</TableCell>
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

export default InsurancePropertyRow;
