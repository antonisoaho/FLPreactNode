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
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import InvestmentForm from '../../forms/savingsAndAssets/InvestmentForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const InvestmentsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'investments',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [Investment & DateFields];
    },

    cacheTime: 0,
    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  const { mutateAsync: removeSubDoc } = useMutation({
    mutationFn: (subDocId: string) => deleteCustSubDocument({ ...formFields, subDocId }),

    onSuccess: () => {
      queryClient.invalidateQueries(['customer']);
    },
  });

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
                  <TableCell colSpan={colSpan}>Inga bankmedel hittades regisrerade.</TableCell>
                </TableRow>
              </TableBody>
            )}
            <TableBody>
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={colSpan}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          <InvestmentForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InvestmentsRow;
