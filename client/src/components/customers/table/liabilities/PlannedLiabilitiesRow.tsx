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
import { LiabilityPlanned } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import LiabilityPlannedForm from '../../forms/liabilities/LiabilityPlannedForm';
import FormCountHandler from '../../forms/FormOpenHandler';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const PlannedLiabilitesRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'liabilities',
    custId: custId!,
    subField: 'planned',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [LiabilityPlanned & DateFields];
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
              (data as [LiabilityPlanned & DateFields])!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>Lån</TableCell>
                      <TableCell>Händelse</TableCell>
                      <TableCell>När (ant. år)</TableCell>
                      <TableCell>Belopp</TableCell>
                      <TableCell>Ränta</TableCell>
                      <TableCell align="right">Uppdaterad</TableCell>
                      <TableCell />
                    </ColoredTableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.loanType || 'Ospecificerat'}</TableCell>
                      <TableCell>{f.event || '-'}</TableCell>
                      <TableCell>{f.when || '-'}</TableCell>
                      <TableCell>{f.amount ? f.amount.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>{f.interest ? f.interest + '%' : '-'}</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
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
                    Ingen framåtplanering av skulder hittades registrerade.
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
          <LiabilityPlannedForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default PlannedLiabilitesRow;
