import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerPension } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [CustomerPension & DateFields];
}

const PensionRow: React.FC<RowProps> = ({ fields }) => {
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
                    <TableCell>Pensionstyp</TableCell>
                    <TableCell>Benämning</TableCell>
                    <TableCell>Värde</TableCell>
                    <TableCell>Pensionsålder</TableCell>
                    <TableCell>Utbet. Tid</TableCell>
                    <TableCell>Gar.Pens. (kr/mån)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.company || '-'}</TableCell>
                    <TableCell>{f.pensionType || '-'}</TableCell>
                    <TableCell>{f.pensionName || '-'}</TableCell>
                    <TableCell>{f.pensionValue?.toLocaleString()}</TableCell>
                    <TableCell>{f.pensionAge || '-'}</TableCell>
                    <TableCell>{f.compensationPeriod || '-'}</TableCell>
                    <TableCell>{f.monthlyPension?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Skalavgift</TableCell>
                    <TableCell>Vägd riskklass</TableCell>
                    <TableCell>Vägd fondavg.</TableCell>
                    <TableCell>Ber. Värdeökn.</TableCell>
                    <TableCell>Sparande (år)</TableCell>
                    <TableCell>ÅB-skydd</TableCell>
                    <TableCell>Förmånstagare</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.shellFee || '-'}</TableCell>
                    <TableCell>{f.riskClass || '-'}</TableCell>
                    <TableCell>{f.fundFee || '-'}</TableCell>
                    <TableCell>{f.estIncreasedValue || '-'}</TableCell>
                    <TableCell>{f.annualSavings?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      {f.commitmentPowers === true
                        ? 'Ja'
                        : f.commitmentPowers === false
                        ? 'Nej'
                        : '-'}
                    </TableCell>
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

export default PensionRow;
