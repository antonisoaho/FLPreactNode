import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import React, { useState } from 'react';
import { DateFields } from '../../../../services/api/models';
import { IncomeBase } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import IncomeBaseForm from '../../forms/incomes/IncomeBaseForm';
import { FormFields } from '../../models/FormProps';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import FormOpenHandler from '../../forms/FormOpenHandler';

const BaseIncomeRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 6;
  const formFields: FormFields = {
    field: 'income',
    custId: custId!,
    subField: 'base',
  };

  const removeSubDoc = useDeleteCustomerSubDoc(formFields);
  const { data, isLoading } = useGetCustomerRowData(formFields);

  if (isLoading) return <TableLoader colSpan={colSpan} />;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [IncomeBase & DateFields])!.map((inc) => (
                <React.Fragment key={inc._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{inc.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inc.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
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
                      <TableCell>
                        {inc!.serviceIncome ? inc!.serviceIncome.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {inc!.ofWhichOwnAB ? inc!.ofWhichOwnAB.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {inc!.companyCarBenefit?.amount
                          ? inc!.companyCarBenefit!.amount.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {inc!.companyCarBenefit?.gross === true
                          ? 'Brutto'
                          : inc!.companyCarBenefit?.gross === false
                          ? 'Netto'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {inc?.soleTraderIncome
                          ? inc!.soleTraderIncome.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>{inc?.taxFree || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
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
                      <TableCell>
                        {inc?.k10?.amount ? inc!.k10!.amount.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {inc?.k10?.savedDistribution
                          ? inc?.k10?.savedDistribution.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {inc?.k10?.salaryBasis
                          ? inc?.k10?.salaryBasis.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {inc?.k10?.ownershipShare ? inc?.k10?.ownershipShare + '%' : '-'}
                      </TableCell>
                      <TableCell />
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(inc._id)}>
                          Ta bort
                        </ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga inkomster registrerade.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            {!formOpen && (
              <TableBody>
                <FormOpenHandler setFormOpen={(value) => setFormOpen(value)} colSpan={colSpan} />
              </TableBody>
            )}
          </Table>
        </Box>
        {formOpen && (
          <IncomeBaseForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseIncomeRow;
