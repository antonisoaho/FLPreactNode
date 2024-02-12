import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import React, { useState } from 'react';
import { DateFields } from '../../../../services/api/models';
import { Assets } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import AssetsForm from '../../forms/savingsAndAssets/AssetsForm';
import { FormFields } from '../../models/FormProps';
import FormOpenHandler from '../../forms/FormOpenHandler';
import { useDeleteCustomerSubDoc } from '../../../../hooks/customer/useDeleteCustomerSubDoc';
import { useGetCustomerRowData } from '../../../../hooks/customer/useGetCustomerRowData';

const AssetsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const formFields: FormFields = {
    field: 'assets',
    custId: custId!,
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
              (data as [Assets & DateFields])!.map((f) => (
                <React.Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{f.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Tillgångstyp</TableCell>
                      <TableCell>Benämning/ID</TableCell>
                      <TableCell>Värde</TableCell>
                      <TableCell>Insats</TableCell>
                      <TableCell>Pantbrev</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.assetType || '-'}</TableCell>
                      <TableCell>{f.name || f._id}</TableCell>
                      <TableCell>{f.value ? f.value.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>{f.stake ? f.stake.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>
                        {f.mortgageDeed ? f.mortgageDeed.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Värderingsår</TableCell>
                      <TableCell>Skatt</TableCell>
                      <TableCell>Taxeringsvärde</TableCell>
                      <TableCell>Rot</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.valueYear?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{f.tax ? f.tax + '%' : '-'}</TableCell>
                      <TableCell>
                        {f.assessedValue ? f.assessedValue.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.base ? f.base.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(f._id)}>Ta bort</ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    Inga tillgångar hittades registrerade.
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
          <AssetsForm setFormOpen={(value) => setFormOpen(value)} formFields={formFields} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default AssetsRow;
