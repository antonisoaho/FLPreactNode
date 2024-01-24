import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { SpousalPension } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [SpousalPension & DateFields];
}

const SpousalPensionRow: React.FC<RowProps> = ({ fields }) => {
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
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell align="right">Uppdaterad:</TableCell>
                    <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                  </ColoredTableRow>
                  <TableRow>
                    <TableCell>Bolag</TableCell>
                    <TableCell>Skattekategori</TableCell>
                    <TableCell>Ersättning</TableCell>
                    <TableCell>Utbet. Tid</TableCell>
                    <TableCell>Premie</TableCell>
                    <TableCell>Förmånstagare</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.company || '-'}</TableCell>
                    <TableCell>
                      {f.taxFree === true
                        ? 'Skattefri'
                        : f.taxFree === false
                        ? 'Skattepliktig'
                        : '-'}
                    </TableCell>
                    <TableCell>{f.compensation?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.compensationPeriod || '-'}</TableCell>
                    <TableCell>{f.premiumCost?.toLocaleString()}</TableCell>
                    <TableCell>{f.beneficiary || '-'}</TableCell>
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

export default SpousalPensionRow;
