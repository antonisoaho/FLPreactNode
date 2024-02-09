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
import FormCountHandler from '../../forms/FormOpenHandler';
import IncomeChangeForm from '../../forms/incomes/IncomeChangeForm';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const ChangeIncomeRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 4;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'income',
    custId: custId!,
    subField: 'change',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [IncomeChange & DateFields];
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
                      <TableCell>{inc.values!.changeType}</TableCell>
                      <TableCell>
                        {inc.values!.when ? inc.values!.when.toLocaleString() + ' år' : '-'}
                      </TableCell>
                      <TableCell>
                        {inc.values!.newAmount !== undefined
                          ? inc.values!.newAmount.toLocaleString() + ' SEK'
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
          <IncomeChangeForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChangeIncomeRow;
