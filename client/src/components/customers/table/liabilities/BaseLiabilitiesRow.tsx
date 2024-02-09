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
import { LiabilityBase } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import FormCountHandler from '../../forms/FormOpenHandler';
import LiabilityBaseForm from '../../forms/liabilities/LiabilityBaseForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const BaseLiabilitiesRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'liabilities',
    custId: custId!,
    subField: 'base',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [LiabilityBase & DateFields];
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
              (data as [LiabilityBase & DateFields])!.map((f) => (
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
                      <TableCell>Lånetyp</TableCell>
                      <TableCell>Långivare</TableCell>
                      <TableCell>Benämning</TableCell>
                      <TableCell>Skuld</TableCell>
                      <TableCell>ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.loanType || 'Ospecificerat'}</TableCell>
                      <TableCell>{f.lender || '-'}</TableCell>
                      <TableCell>{f.name || '-'}</TableCell>
                      <TableCell>{f.debt ? f.debt.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>{f._id}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ränta</TableCell>
                      <TableCell>Amort. (kr/mån)</TableCell>
                      <TableCell>Räntebindning</TableCell>
                      <TableCell>Låneskydd?</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.interest ? f.interest + '%' : '-'}</TableCell>
                      <TableCell>
                        {f.monthlyAmortization
                          ? f.monthlyAmortization.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(f.lockInterestDate!).toLocaleDateString() || '-'}
                      </TableCell>
                      <TableCell>{f.loanProtection ? 'Ja' : 'Nej'}</TableCell>
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
                    Inga skulder hittades registrerade.
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
          <LiabilityBaseForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseLiabilitiesRow;
