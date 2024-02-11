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
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { FormFields } from '../../models/FormProps';
import FormOpenHandler from '../../forms/FormOpenHandler';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';

const CustomerDetailsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const formFields: FormFields = {
    field: 'customerDetails',
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
        {formOpen && (
          <CustomerDetailsForm
            setFormOpen={(value) => setFormOpen(value)}
            formFields={formFields}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CustomerDetailsRow;
