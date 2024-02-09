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
import { SpousalPension } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import SpousalPensionForm from '../../forms/pensions/SpousalPensionForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const SpousalPensionRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'spousalPension',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [SpousalPension & DateFields];
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
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [SpousalPension & DateFields])!.map((f) => (
                <Fragment key={f._id}>
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
                      <TableCell>Skattekategori</TableCell>
                      <TableCell>Ersättning</TableCell>
                      <TableCell>Utbet. Tid</TableCell>
                      <TableCell>Premie</TableCell>
                      <TableCell>Förmånstagare</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.company || '-'}</TableCell>
                      <TableCell>
                        {f.taxFree === true
                          ? 'Skattefri'
                          : f.taxFree === false
                          ? 'Skattepliktig'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {f.compensation ? f.compensation.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {f.compensationPeriod ? f.compensationPeriod + ' år' : '-'}
                      </TableCell>
                      <TableCell>{f.premiumCost ? f.premiumCost.toLocaleString() : '-'}</TableCell>
                      <TableCell>{f.beneficiary || '-'}</TableCell>
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
                    Inga efterlevandepensioner registrerade.
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
          <SpousalPensionForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default SpousalPensionRow;
