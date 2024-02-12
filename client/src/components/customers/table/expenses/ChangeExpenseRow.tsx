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
import { ExpensesChange } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import ExpenseChangeForm from '../../forms/expenses/ExpenseChangeForm';
import { FormFields } from '../../models/FormProps';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import FormOpenHandler from '../../forms/FormOpenHandler';

const ChangeIncomeRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const formFields: FormFields = {
    field: 'expenses',
    custId: custId!,
    subField: 'change',
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
                <TableCell>Typ av ändring</TableCell>
                <TableCell>När</TableCell>
                <TableCell>Nytt belopp</TableCell>
                <TableCell>Pågår</TableCell>
                <TableCell>Kommentar</TableCell>
                <TableCell>Uppdaterad</TableCell>
                <TableCell />
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {data!.length > 0 ? (
                (data as [ExpensesChange & DateFields])!.map((exp) => (
                  <TableRow key={exp._id}>
                    <TableCell>{exp.values!.changeType || '-'}</TableCell>
                    <TableCell>{exp.values!.when?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{exp.values!.value || '-'}</TableCell>
                    <TableCell>{exp.values!.ongoing?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{exp.values!.comment || '-'}</TableCell>
                    <TableCell>{new Date(exp.updatedAt!).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <ListItemButton onClick={() => removeSubDoc(exp._id)}>Ta bort</ListItemButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga planerade utgifter hittades.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {!formOpen && (
              <TableBody>
                <FormOpenHandler setFormOpen={(value) => setFormOpen(value)} colSpan={colSpan} />
              </TableBody>
            )}
          </Table>
        </Box>
        {formOpen && (
          <ExpenseChangeForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
