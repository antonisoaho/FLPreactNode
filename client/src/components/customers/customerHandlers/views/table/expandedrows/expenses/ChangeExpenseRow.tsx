import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { ExpensesChange } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  getCustomerFormData,
  deleteCustSubDocument,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import ExpenseChangeForm from '../../../forms/expenses/ExpenseChangeForm';

const ChangeIncomeRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[ExpensesChange & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 7;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const updateCustomerFields = async () => {
    const formResponse = await getCustomerFormData({
      field: 'expenses',
      _id: custId as string,
      subField: 'change',
    });

    if (formResponse.success) {
      setFields(formResponse.data as [ExpensesChange & DateFields]);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId, updateCustomerFields]);

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'expenses',
      custId: custId!,
      subDocId: subDocId,
      subField: 'change',
    });

    if (response.success) setFields(response.data as [ExpensesChange & DateFields]);
  };

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
              {loading ? (
                <TableLoader colSpan={colSpan} />
              ) : fields!.length > 0 ? (
                fields!.map((exp) => (
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
                  <TableCell colSpan={colSpan}>Inga ändringar hittades</TableCell>
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
          <ExpenseChangeForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
