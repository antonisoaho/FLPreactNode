import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerDetails, ExpensesBase } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  getCustomerFormData,
  deleteCustSubDocument,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import ExpenseBaseForm from '../../../forms/expenses/ExpenseBaseForm';

const BaseExpenseRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[ExpensesBase & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [persons, setPersons] = useState<string[]>([]);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const updateCustomerFields = async () => {
    const formResponse = await getCustomerFormData({
      field: 'expenses',
      _id: custId as string,
      subField: 'base',
    });

    if (formResponse.success) {
      setFields(formResponse.data as [ExpensesBase & DateFields]);
      setLoading(false);
    }
  };

  const populatePersons = async () => {
    const personResponse = await getCustomerFormData({
      field: 'customerDetails',
      _id: custId as string,
    });

    if (personResponse.success) {
      const names = (personResponse.data as CustomerDetails[]).map((cust) => cust.name as string);

      setPersons(names);
    }
  };

  useEffect(() => {
    populatePersons();
    updateCustomerFields();
  }, [custId]);

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'expenses',
      custId: custId!,
      subDocId: subDocId,
      subField: 'base',
    });

    if (response.success) setFields(response.data as [ExpensesBase & DateFields]);
  };

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {loading ? (
              <TableBody>
                <TableLoader colSpan={colSpan} />
              </TableBody>
            ) : fields!.length > 0 ? (
              fields?.map((exp) => (
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
                  {persons.map((person, idx) => (
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
          <ExpenseBaseForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseExpenseRow;
