import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { Fragment, useState } from 'react';
import { DateFields } from '../../../../services/api/models';
import { IncomeChange } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import IncomeChangeForm from '../../forms/incomes/IncomeChangeForm';
import { useParams } from 'react-router-dom';
import { FormFields } from '../../models/FormProps';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import FormOpenHandler from '../../forms/FormOpenHandler';

const ChangeIncomeRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 4;
  const formFields: FormFields = {
    field: 'income',
    custId: custId!,
    subField: 'change',
  };

  const removeSubDoc = useDeleteCustomerSubDoc(formFields);
  const { data, isLoading } = useGetCustomerRowData(formFields);

  if (isLoading) return <TableLoader colSpan={colSpan} />;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [IncomeChange & DateFields])!.map((inc) => (
                <Fragment key={inc._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{inc.belongs}</TableCell>
                      <TableCell />

                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inc.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Typ av ändring</TableCell>
                      <TableCell>När</TableCell>
                      <TableCell>Nytt belopp</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{inc!.changeType}</TableCell>
                      <TableCell>{inc!.when ? inc!.when.toLocaleString() + ' år' : '-'}</TableCell>
                      <TableCell>
                        {inc!.newAmount !== undefined
                          ? inc!.newAmount.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <ListItemButton onClick={() => removeSubDoc(inc._id)}>
                          Ta bort
                        </ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga planerade inkomstförändringar hittade.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            {!formOpen && (
              <TableBody>
                <FormOpenHandler setFormOpen={(value) => setFormOpen(value)} colSpan={colSpan} />
              </TableBody>
            )}
          </Table>
        </Box>
        {formOpen && (
          <IncomeChangeForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
