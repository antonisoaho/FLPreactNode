import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { Fragment, useState } from 'react';
import { DateFields } from '../../../../services/api/models';
import { BankFund } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  getCustomerFormData,
  deleteCustSubDocument,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import BankFundForm from '../../forms/savingsAndAssets/BankFundForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const BankFundsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'bankFunds',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [BankFund & DateFields];
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
              (data as [BankFund & DateFields])!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{f.belongs}</TableCell>
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
                      <TableCell>Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.accountType || '-'}</TableCell>
                      <TableCell>{f.institution || '-'}</TableCell>
                      <TableCell>{f.name || f._id}</TableCell>
                      <TableCell>{f.timePerspective || '-'}</TableCell>
                      <TableCell>{f.value ? f.value.toLocaleString() + ' SEK' : '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Månadsspar</TableCell>
                      <TableCell>Spartid (år)</TableCell>
                      <TableCell>Ränta</TableCell>
                      <TableCell>Tänkt tillväxt</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {f.monthlySavings ? f.monthlySavings.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.saveForHowLong || '-'}</TableCell>
                      <TableCell>{f.interestRate ? f.interestRate + '%' : '-'}</TableCell>
                      <TableCell>{f.projectedGrowth ? f.projectedGrowth + '%' : '-'}</TableCell>
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(f._id)}>Ta bort</ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga bankmedel hittades registrerade.
                  </TableCell>
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
          <BankFundForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BankFundsRow;
