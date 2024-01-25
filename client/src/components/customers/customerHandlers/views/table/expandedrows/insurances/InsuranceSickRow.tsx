import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { InsuranceSickness } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [InsuranceSickness & DateFields];
}

const InsuranceSickRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((f) => (
              <React.Fragment key={f._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>{f.belongs}</TableCell>
                    <TableCell />
                    <TableCell align="right">Uppdaterad:</TableCell>
                    <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                  </ColoredTableRow>
                  <TableRow>
                    <TableCell>Bolag</TableCell>
                    <TableCell>Benämning</TableCell>
                    <TableCell>Skattekategori</TableCell>
                    <TableCell>Karens</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.company || '-'}</TableCell>
                    <TableCell>{f.insuranceType || '-'}</TableCell>
                    <TableCell>
                      {f.taxFree === true
                        ? 'Skattefri'
                        : f.taxFree === false
                        ? 'Skattepliktig'
                        : '-'}
                    </TableCell>
                    <TableCell>{f.qualifyingPeriod || '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Ersättning</TableCell>
                    <TableCell>Premie (kr/år)</TableCell>
                    <TableCell>Förfallodag</TableCell>
                    <TableCell>Ers. tid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.compensationAmount?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.premiumCost?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.expiryDate || '-'}</TableCell>
                    <TableCell>{f.compensationPeriod || '-'}</TableCell>
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

export default InsuranceSickRow;
