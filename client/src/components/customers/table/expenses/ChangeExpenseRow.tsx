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
import {
  getCustomerFormData,
  deleteCustSubDocument,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import ExpenseChangeForm from '../../forms/expenses/ExpenseChangeForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const ChangeIncomeRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'expenses',
    custId: custId!,
    subField: 'change',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [ExpensesChange & DateFields];
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
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={colSpan}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          <ExpenseChangeForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
