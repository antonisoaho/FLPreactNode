import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { BankFund } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [BankFund & DateFields];
}

const BankFundsRow: React.FC<RowProps> = ({ fields }) => {
  fields.sort((a, b) => {
    if (a.belongs === 'Gemensamt') return -1;
    if (b.belongs === 'Gemensamt') return 1;

    return a.belongs! > b.belongs! ? 1 : -1;
  });

  console.log('fields', fields);

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
                    <TableCell align="right">Uppdaterad:</TableCell>
                    <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                  </ColoredTableRow>
                  <TableRow>
                    <TableCell>Kontotyp</TableCell>
                    <TableCell>Bank</TableCell>
                    <TableCell>Benämning/ID</TableCell>
                    <TableCell>Tidsperspektiv</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Saldo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.accounType || '-'}</TableCell>
                    <TableCell>{f.institution || '-'}</TableCell>
                    <TableCell>{f.name || f._id}</TableCell>
                    <TableCell>{f.timePerspective || '-'}</TableCell>
                    <TableCell />
                    <TableCell>{f.value?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Månadsspar</TableCell>
                    <TableCell>Spartid (år)</TableCell>
                    <TableCell>Ränta</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>Tänkt tillväxt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.monthlySavings?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.saveForHowLong || '-'}</TableCell>
                    <TableCell>{f.interestRate || '-'}</TableCell>
                    <TableCell />
                    <TableCell>{f.projectedGrowth || '-'}</TableCell>
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

export default BankFundsRow;
