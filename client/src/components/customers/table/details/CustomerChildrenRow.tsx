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
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import { FormFields } from '../../models/FormProps';
import FormOpenHandler from '../../forms/FormOpenHandler';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';

const CustomerChildrenRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const formFields: FormFields = {
    field: 'customerChildren',
    custId: custId!,
  };
  const removeSubDoc = useDeleteCustomerSubDoc(formFields);
  const { data, isLoading } = useGetCustomerRowData(formFields);

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
        {formOpen && (
          <CustomerChildForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CustomerChildrenRow;
