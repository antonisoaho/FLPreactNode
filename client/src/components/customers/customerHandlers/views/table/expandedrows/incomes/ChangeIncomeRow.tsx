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
import { IncomeChange } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import IncomeChangeForm from '../../../forms/incomes/IncomeChangeForm';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';

const ChangeIncomeRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[IncomeChange & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'income',
      _id: custId as string,
      subField: 'change',
    });

    if (response.success) {
      setFields(response.data as [IncomeChange & DateFields]);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'income',
      custId: custId!,
      subDocId: subDocId,
      subField: 'change',
    });

    if (response.success) setFields(response.data as [IncomeChange & DateFields]);
  };

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {loading ? (
              <TableBody>
                <TableLoader colSpan={colSpan} />
              </TableBody>
            ) : fields!.length > 0 ? (
              fields!.map((inc) => (
                <Fragment key={inc._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{inc.belongs}</TableCell>
                      <TableCell />
                      <TableCell />

                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inc.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell />
                      <TableCell>Typ av ändring</TableCell>
                      <TableCell>När</TableCell>
                      <TableCell>Nytt belopp</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{inc.values!.changeType}</TableCell>
                      <TableCell>{inc.values!.when?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inc.values!.newAmount?.toLocaleString() || '-'}</TableCell>
                      <TableCell />
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
                  <TableCell colSpan={colSpan}>
                    Inga planerade inkomstförändringar hittade.
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
          <IncomeChangeForm
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
