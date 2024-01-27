import { TableCell, Box, Table, TableHead, TableRow, TableBody, Button } from '@mui/material';
import React, { useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerChildren } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import FormCountHandler from '../../../forms/FormCountHandler';
import CustomerChildForm from '../../../forms/CustomerChildForm';
import { deleteCustSubDocument } from '../../../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';

interface RowProps {
  fields: [CustomerChildren & DateFields];
}

const CustomerChildrenRow: React.FC<RowProps> = ({ fields }) => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();

  const onSubmit = () => {
    console.log('refreshData');
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument('customerChildren', custId!, subDocId);

    console.log('response.data', response.data);
  };

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
                <TableCell />
                <TableCell align="right">Uppdaterad</TableCell>
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {fields!.map((child) => (
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
                    <Button onClick={() => removeSubDoc(child._id)}>Ta bort</Button>
                  </TableCell>
                </TableRow>
              ))}
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={7}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          /** Renders the CustomerChildForm component to allow
           * adding a new child subdocument to the customer document.
           */
          <CustomerChildForm
            submitted={onSubmit}
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CustomerChildrenRow;
