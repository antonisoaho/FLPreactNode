import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { useState } from 'react';
import { DateFields } from '../../../../services/api/models';
import { CustomerChildren } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import CustomerChildForm from '../../forms/details/CustomerChildForm';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { FormFields } from '../../models/FormProps';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { enqueueSnackbar } from 'notistack';
import FormOpenHandler from '../../forms/FormOpenHandler';

const CustomerChildrenRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'customerChildren',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [CustomerChildren & DateFields];
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
            <TableHead>
              <ColoredTableRow>
                <TableCell>Namn</TableCell>
                <TableCell>Tillhör</TableCell>
                <TableCell>Barnbidrag räknas</TableCell>
                <TableCell>Född</TableCell>
                <TableCell>Bor hemma till</TableCell>
                <TableCell>Uppdaterad</TableCell>
                <TableCell />
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {data!.length > 0 ? (
                (data as [CustomerChildren & DateFields])?.map((child) => (
                  <TableRow key={child._id}>
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.belongs || '-'}</TableCell>
                    <TableCell>{child.childSupportCounts ? 'Ja' : 'Nej'}</TableCell>
                    <TableCell>{child.yearMonth}</TableCell>
                    <TableCell>{child.livesAtHomeToAge}</TableCell>
                    <TableCell align="right">
                      {new Date(child.updatedAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ListItemButton onClick={() => removeSubDoc(child._id)}>
                        Ta bort
                      </ListItemButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga barn registrerade.
                  </TableCell>
                </TableRow>
              )}
              {!formOpen && (
                <FormOpenHandler setFormOpen={(value) => setFormOpen(value)} colSpan={colSpan} />
              )}
            </TableBody>
          </Table>
        </Box>
        {formOpen && <CustomerChildForm setFormOpen={(value) => setFormOpen(value)} />}
      </TableCell>
    </TableRow>
  );
};

export default CustomerChildrenRow;
