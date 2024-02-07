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
import { CustomerDetails } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import CustomerDetailsForm from '../../../forms/details/CustomerDetailsForm';
import FormCountHandler from '../../../forms/FormCountHandler';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import TableLoader from '../../TableLoader';

const CustomerDetailsRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[CustomerDetails & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'customerDetails',
      _id: custId as string,
    });

    if (response.success) {
      setFields(response.data!);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'customerDetails',
      custId: custId!,
      subDocId: subDocId,
    });

    if (response.success) setFields(response.data);
  };

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
              {loading ? (
                <TableLoader colSpan={colSpan} />
              ) : fields!.length > 0 ? (
                fields!.map((person) => (
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
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={colSpan}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          <CustomerDetailsForm
            submitted={onSubmit}
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CustomerDetailsRow;
