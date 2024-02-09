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
import { InsuranceWork } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import FormCountHandler from '../../forms/FormOpenHandler';
import WorkInsuranceForm from '../../forms/insurances/WorkInsuranceForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const InsuranceWorkRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 6;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'insurances',
    custId: custId!,
    subField: 'work',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [InsuranceWork & DateFields];
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
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {data!.length > 0 ? (
              (data as [InsuranceWork & DateFields])!.map((f) => (
                <React.Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>Tillhör</TableCell>
                      <TableCell>Försäkringstyp</TableCell>
                      <TableCell>Uppdaterad</TableCell>
                      <TableCell />
                    </ColoredTableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.belongs || '-'}</TableCell>
                      <TableCell>{f.insuranceType || '-'}</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
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
                    Inga försäkringar registrerade.
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
          <WorkInsuranceForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsuranceWorkRow;
