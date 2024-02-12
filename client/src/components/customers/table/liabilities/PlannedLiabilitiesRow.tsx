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
import { LiabilityPlanned } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import LiabilityPlannedForm from '../../forms/liabilities/LiabilityPlannedForm';
import { FormFields } from '../../models/FormProps';
import FormOpenHandler from '../../forms/FormOpenHandler';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';

const PlannedLiabilitesRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 7;
  const formFields: FormFields = {
    field: 'liabilities',
    custId: custId!,
    subField: 'planned',
  };

  const removeSubDoc = useDeleteCustomerSubDoc(formFields);
  const { data, isLoading } = useGetCustomerRowData(formFields);

  if (isLoading) return <TableLoader colSpan={colSpan} />;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [LiabilityPlanned & DateFields])!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>Lån</TableCell>
                      <TableCell>Händelse</TableCell>
                      <TableCell>När (ant. år)</TableCell>
                      <TableCell>Belopp</TableCell>
                      <TableCell>Ränta</TableCell>
                      <TableCell align="right">Uppdaterad</TableCell>
                      <TableCell />
                    </ColoredTableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.loanType || 'Ospecificerat'}</TableCell>
                      <TableCell>{f.event || '-'}</TableCell>
                      <TableCell>{f.when || '-'}</TableCell>
                      <TableCell>{f.amount ? f.amount.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>{f.interest ? f.interest + '%' : '-'}</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(f._id)}>Ta bort</ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Ingen framåtplanering av skulder hittades registrerade.
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
          <LiabilityPlannedForm
            setFormOpen={(value) => setFormOpen(value)}
            formFields={formFields}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default PlannedLiabilitesRow;
