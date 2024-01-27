import { TableCell, Box, Table, TableHead, TableRow, TableBody, Button } from '@mui/material';
import React, { useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerDetails } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import CustomerDetailsForm from '../../../forms/CustomerDetailsForm';
import FormCountHandler from '../../../forms/FormCountHandler';
import { deleteCustSubDocument } from '../../../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';

interface RowProps {
  fields: [CustomerDetails & DateFields];
}

const CustomerDetailsRow: React.FC<RowProps> = ({ fields }) => {
  const [formCount, setFormCount] = useState<number>(0);

  const { custId } = useParams();

  const onSubmit = () => {
    console.log('refreshData');
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument('customerDetails', custId!, subDocId);

    console.log('response.data', response.data);
  };

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            <TableHead>
              <ColoredTableRow>
                <TableCell />
                <TableCell>Namn</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Född</TableCell>
                <TableCell align="right">Uppdaterad</TableCell>
                <TableCell />
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {fields!.map((person) => (
                <TableRow key={person._id}>
                  <TableCell />

                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.status}</TableCell>
                  <TableCell>{person.yearMonth}</TableCell>
                  <TableCell align="right">
                    {new Date(person.updatedAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => removeSubDoc(person._id)}>Ta bort</Button>
                  </TableCell>
                </TableRow>
              ))}
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={6}
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
