import { TableCell, Collapse, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../apiCalls/models/ApiModel';
import { IncomeBase } from '../../../edit/forms/models/CustomerFormModels';

interface RowProps {
  fields: [IncomeBase & DateFields];
}

const BaseIncomeRow: React.FC<RowProps> = ({ fields }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Collapse in={true} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Table size="small" aria-label="more-info">
              {fields!.map((inc) => (
                <React.Fragment key={inc._id}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{inc.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inc.updatedAt!).toLocaleDateString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell />
                      <TableCell>Tjänsteink.</TableCell>
                      <TableCell>Varav eget AB</TableCell>
                      <TableCell>Tj. bilförmån</TableCell>
                      <TableCell>Löneavdragstyp</TableCell>
                      <TableCell>NE Inkomst</TableCell>
                      <TableCell>Skattefritt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                      <TableCell>{inc.values!.serviceIncome?.toLocaleString()}</TableCell>
                      <TableCell>{inc.values!.ofWhichOwnAB?.toLocaleString() || '-'}</TableCell>
                      <TableCell>
                        {inc.values!.companyCarBenefit?.amount?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        {inc.values!.companyCarBenefit?.gross === true
                          ? 'Brutto'
                          : inc.values!.companyCarBenefit?.gross === false
                          ? 'Netto'
                          : '-'}
                      </TableCell>
                      <TableCell>{inc.values?.soleTraderIncome || '-'}</TableCell>
                      <TableCell>{inc.values?.taxFree || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>K10 ut</TableCell>
                      <TableCell>Sparad utd.</TableCell>
                      <TableCell>Löneunderlag</TableCell>
                      <TableCell>Ägarandel</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                      <TableCell>{inc.values?.k10?.amount?.toLocaleString() || '-'}</TableCell>
                      <TableCell>
                        {inc.values?.k10?.savedDistribution?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>{inc.values?.k10?.salaryBasis?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inc.values?.k10?.ownershipShare || '-'}</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))}
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default BaseIncomeRow;
