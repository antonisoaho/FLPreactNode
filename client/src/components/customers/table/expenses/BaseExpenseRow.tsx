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
import { ExpensesBase } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import ExpenseBaseForm from '../../forms/expenses/ExpenseBaseForm';
import { FormFields } from '../../models/FormProps';
import { useGetCustomerNames } from '../../../../hooks/customer/useGetCustomerNames';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';
import FormOpenHandler from '../../forms/FormOpenHandler';

const BaseExpenseRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const formFields: FormFields = {
    field: 'expenses',
    custId: custId!,
    subField: 'base',
  };

  const { persons } = useGetCustomerNames(custId as string);
  const removeSubDoc = useDeleteCustomerSubDoc(formFields);
  const { data, isLoading } = useGetCustomerRowData(formFields);

  if (isLoading) return <TableLoader colSpan={colSpan} />;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [ExpensesBase & DateFields])?.map((exp) => (
                <Fragment key={exp._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell colSpan={colSpan / 2}>Utgiftstyp</TableCell>
                      <TableCell colSpan={colSpan / 2}>Kartlaggt</TableCell>
                      <TableCell />
                    </ColoredTableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={colSpan / 2}>{exp.values?.expenseType}</TableCell>
                      <TableCell colSpan={colSpan / 2}>
                        {exp.values?.mapped ? exp.values!.mapped.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                  {persons?.map((person, idx) => (
                    <Fragment key={person}>
                      <TableHead>
                        <ColoredTableRow key={person + 'header'}>
                          <TableCell>{person.split(' ')[0] + ' pensionsålder'}</TableCell>
                          <TableCell>{person.split(' ')[0] + ' aktivslut ålder'}</TableCell>
                          <TableCell>{person.split(' ')[0] + ' pension'}</TableCell>
                          <TableCell>{person.split(' ')[0] + ' aktiv slut'}</TableCell>
                          <TableCell>{person.split(' ')[0] + ' dödsfall'}</TableCell>
                        </ColoredTableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{exp.values?.pension?.[idx] || '-'}</TableCell>
                          <TableCell>{exp.values?.activeEnd?.[idx] || '-'}</TableCell>
                          <TableCell>
                            {exp.values?.difPension?.[idx]
                              ? exp.values?.difPension?.[idx].toLocaleString() + ' SEK'
                              : 0}
                          </TableCell>
                          <TableCell>
                            {exp.values?.difActiveEnd?.[idx]
                              ? exp.values?.difActiveEnd?.[idx].toLocaleString() + ' SEK'
                              : 0}
                          </TableCell>
                          <TableCell>
                            {exp.values?.difDeath?.[idx]
                              ? exp.values?.difDeath?.[idx].toLocaleString() + ' SEK'
                              : 0}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Fragment>
                  ))}
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={colSpan - 1} />
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(exp._id)}>
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
                    Inga utgifter registrerade på kund.
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
          <ExpenseBaseForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseExpenseRow;
