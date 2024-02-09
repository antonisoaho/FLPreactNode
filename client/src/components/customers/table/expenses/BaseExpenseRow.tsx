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
import { CustomerDetails, ExpensesBase } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  getCustomerFormData,
  deleteCustSubDocument,
  getCustomerNames,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import ExpenseBaseForm from '../../forms/expenses/ExpenseBaseForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const BaseExpenseRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const [persons, setPersons] = useState<string[]>([]);
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'expenses',
    custId: custId!,
    subField: 'base',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [ExpensesBase & DateFields];
    },

    cacheTime: 0,
    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  useQuery({
    queryKey: ['customerDetails', custId],
    queryFn: () => getCustomerNames(formFields.custId),

    onSuccess: (data) => {
      setPersons(data);
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
            <TableBody>
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={colSpan}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          <ExpenseBaseForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseExpenseRow;
