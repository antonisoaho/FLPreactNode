import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { LiabilityBase } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [LiabilityBase & DateFields];
}

const BaseLiabilitiesRow: React.FC<RowProps> = ({ fields }) => {
  fields.sort((a, b) => {
    if (a.belongs === 'Gemensamt') return -1;
    if (b.belongs === 'Gemensamt') return 1;

    return a.belongs! > b.belongs! ? 1 : -1;
  });

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
                    <TableCell>Lånetyp</TableCell>
                    <TableCell>Långivare</TableCell>
                    <TableCell>Benämning</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Skuld</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.loanType || 'Ospecificerat'}</TableCell>
                    <TableCell>{f.lender || '-'}</TableCell>
                    <TableCell>{f.name || '-'}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{f.debt?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Ränta</TableCell>
                    <TableCell>Amort. (kr/mån)</TableCell>
                    <TableCell>Räntebindning</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>Låneskydd?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.interest || '-'}</TableCell>
                    <TableCell>{f.monthlyAmortization?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      {new Date(f.lockInterestDate).toLocaleDateString() || '-'}
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>{f.loanProtection ? 'Ja' : 'Nej'}</TableCell>
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

export default BaseLiabilitiesRow;
