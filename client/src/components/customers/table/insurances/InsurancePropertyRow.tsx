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
import { InsuranceProperty } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import PropertyInsuranceForm from '../../forms/insurances/PropertyInsuranceForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const InsurancePropertyRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 6;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'insurances',
    custId: custId!,
    subField: 'property',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [InsuranceProperty & DateFields];
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
              (data as [InsuranceProperty & DateFields])!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell colSpan={colSpan - 2}>{f.propertyType || '-'}</TableCell>
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                  </TableHead>
                  <TableHead>
                    <TableCell>Bolag</TableCell>
                    <TableCell>Förfallodag</TableCell>
                    <TableCell>Premie</TableCell>
                    <TableCell>Betalning</TableCell>
                    <TableCell>Senast kontroll</TableCell>
                    <TableCell />
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.company || '-'}</TableCell>
                      <TableCell>{new Date(f.expiryDate!).toLocaleDateString() || '-'}</TableCell>
                      <TableCell>
                        {f.premiumCost ? f.premiumCost.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.paymentPeriod || '-'}</TableCell>
                      <TableCell>{new Date(f.lastControl!).toLocaleDateString() || '-'}</TableCell>
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
                  <TableCell colSpan={colSpan} align="center">
                    Inga egendomsförsäkringar hittade.
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
          <PropertyInsuranceForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsurancePropertyRow;
