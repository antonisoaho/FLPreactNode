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
import { Investment } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import InvestmentForm from '../../forms/savingsAndAssets/InvestmentForm';
import { FormFields } from '../../models/FormProps';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import FormOpenHandler from '../../forms/FormOpenHandler';

const InvestmentsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const formFields: FormFields = {
    field: 'investments',
    custId: custId!,
  };

  const removeSubDoc = useDeleteCustomerSubDoc(formFields);
  const { data, isLoading } = useGetCustomerRowData(formFields);

  if (isLoading) return <TableLoader colSpan={colSpan} />;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [Investment & DateFields])!.map((inv) => (
                <React.Fragment key={inv._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{inv.belongs}</TableCell>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{inv.investmentType || '-'}</TableCell>
                      <TableCell>{inv.institution || '-'}</TableCell>
                      <TableCell>{inv.name || inv._id}</TableCell>
                      <TableCell>
                        {inv.depositedAmount ? inv.depositedAmount.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{inv.value ? inv.value.toLocaleString() + ' SEK' : '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tidsperspektiv</TableCell>
                      <TableCell>Spartid</TableCell>
                      <TableCell>Vägd riskklass</TableCell>
                      <TableCell>Vägd förv. Avgift</TableCell>
                      <TableCell>Skalavgift</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{inv.timePerspective || '-'}</TableCell>
                      <TableCell>{inv.saveForHowLong ? inv.saveForHowLong + ' år' : '-'}</TableCell>
                      <TableCell>{inv.riskClass || '-'}</TableCell>
                      <TableCell>{inv.managementFee ? inv.managementFee + '%' : '-'}</TableCell>
                      <TableCell>{inv.shellFee ? inv.shellFee + '%' : '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Månadsspar</TableCell>
                      <TableCell>Tilläggsinvestering</TableCell>
                      <TableCell>När sker tillägget</TableCell>
                      <TableCell>Tänkt tillväxt</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {inv.monthlySavings ? inv.monthlySavings.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {inv.additionalInvestment
                          ? inv.additionalInvestment.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>{inv.when || '-'}</TableCell>
                      <TableCell>{inv.projectedGrowth ? inv.projectedGrowth + '%' : '-'}</TableCell>
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(inv._id)}>
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
                  <TableCell colSpan={colSpan}>Inga investeringar hittades regisrerade.</TableCell>
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
          <InvestmentForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InvestmentsRow;
