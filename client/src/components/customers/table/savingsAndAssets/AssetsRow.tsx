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
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import AssetsForm from '../../forms/savingsAndAssets/AssetsForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const AssetsRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'assets',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [Assets & DateFields];
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
          <AssetsForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default AssetsRow;
