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
import { CustomerDetails } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import CustomerDetailsForm from '../../forms/details/CustomerDetailsForm';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FormFields } from '../../models/FormProps';
import FormOpenHandler from '../../forms/FormOpenHandler';

const CustomerDetailsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'customerDetails',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [CustomerDetails & DateFields];
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
            <TableHead>
              <ColoredTableRow>
                <TableCell>Namn</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Född</TableCell>
                <TableCell align="right">Uppdaterad</TableCell>
                <TableCell />
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {data!.length > 0 ? (
                (data as [CustomerDetails & DateFields])?.map((person) => (
                  <TableRow key={person._id}>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.status}</TableCell>
                    <TableCell>{person.yearMonth}</TableCell>
                    <TableCell align="right">
                      {new Date(person.updatedAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ListItemButton onClick={() => removeSubDoc(person._id)}>
                        Ta bort
                      </ListItemButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga personer registrerade.
                  </TableCell>
                </TableRow>
              )}

              {!formOpen && (
                <FormOpenHandler setFormOpen={(value) => setFormOpen(value)} colSpan={colSpan} />
              )}
            </TableBody>
          </Table>
        </Box>
        {formOpen && <CustomerDetailsForm setFormOpen={(value) => setFormOpen(value)} />}
      </TableCell>
    </TableRow>
  );
};

export default CustomerDetailsRow;
