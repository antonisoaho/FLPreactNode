import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { Investment } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [Investment & DateFields];
}

const InvestmentsRow: React.FC<RowProps> = ({ fields }) => {
  fields.sort((a, b) => (a.belongs! > b.belongs! ? 1 : -1));
  console.log('fields', fields);

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((inv) => (
              <React.Fragment key={inv._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>{inv.belongs}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell align="right">Uppdaterad:</TableCell>
                    <TableCell>{new Date(inv.updatedAt!).toLocaleDateString()}</TableCell>
                  </ColoredTableRow>
                  <TableRow>
                    <TableCell>Typ (ISK, K, Depå)</TableCell>
                    <TableCell>Institut</TableCell>
                    <TableCell>Benämning/ID</TableCell>
                    <TableCell>Insatt</TableCell>
                    <TableCell>Värde</TableCell>
                    <TableCell>Tidsperspektiv</TableCell>
                    <TableCell>Spartid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{inv.investmentType || '-'}</TableCell>
                    <TableCell>{inv.institution || '-'}</TableCell>
                    <TableCell>{inv.name || inv._id}</TableCell>
                    <TableCell>{inv.depositedAmount?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{inv.value?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{inv.timePerspective || '-'}</TableCell>
                    <TableCell>{inv.saveForHowLong || '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Vägd riskklass</TableCell>
                    <TableCell>Vägd förv. Avgift</TableCell>
                    <TableCell>Skalavgift</TableCell>
                    <TableCell>Månadsspar</TableCell>
                    <TableCell>Tilläggsinvestering</TableCell>
                    <TableCell>När sker tillägget</TableCell>
                    <TableCell>Tänkt tillväxt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{inv.riskClass || '-'}</TableCell>
                    <TableCell>{inv.managementFee || '-'}</TableCell>
                    <TableCell>{inv.shellFee || '-'}</TableCell>
                    <TableCell>{inv.monthlySavings || '-'}</TableCell>
                    <TableCell>{inv.additinalInvestment || '-'}</TableCell>
                    <TableCell>{inv.when || '-'}</TableCell>
                    <TableCell>{inv.projectedGrowth || '-'}</TableCell>
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

export default InvestmentsRow;
