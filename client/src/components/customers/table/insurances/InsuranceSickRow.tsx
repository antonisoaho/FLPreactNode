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
import { InsuranceSickness } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import SickInsuranceForm from '../../forms/insurances/SickInsuranceForm';
import {
  qualifyingPeriodSickness,
  compensationPeriodSickness,
} from '../../../../utils/formVariables';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const InsuranceSickRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 5;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'insurances',
    custId: custId!,
    subField: 'sickness',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [InsuranceSickness & DateFields];
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
              (data as [InsuranceSickness & DateFields])!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{f.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Bolag</TableCell>
                      <TableCell>Benämning</TableCell>
                      <TableCell>Skattekategori</TableCell>
                      <TableCell>Karens</TableCell>
                      <TableCell>Ersättning</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.company || '-'}</TableCell>
                      <TableCell>{f.insuranceType || '-'}</TableCell>
                      <TableCell>
                        {f.taxFree === true
                          ? 'Skattefri'
                          : f.taxFree === false
                          ? 'Skattepliktig'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {qualifyingPeriodSickness.find((obj) => {
                          return obj.value === f.qualifyingPeriod;
                        })?.label || '-'}
                      </TableCell>
                      <TableCell>
                        {f.compensationAmount
                          ? f.compensationAmount.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Premie (kr/år)</TableCell>
                      <TableCell>Förfallodag</TableCell>
                      <TableCell>Ers. tid</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {f.premiumCost ? f.premiumCost.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {f.expiryDate ? new Date(f.expiryDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {compensationPeriodSickness.find((obj) => {
                          return obj.value === f.compensationPeriod;
                        })?.label || '-'}
                      </TableCell>
                      <TableCell />
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
                    Inga sjukdomsförsäkringar hittades registrerade.
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
          <SickInsuranceForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsuranceSickRow;
