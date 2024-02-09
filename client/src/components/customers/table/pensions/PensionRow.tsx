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
import { CustomerPension } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import FormCountHandler from '../../forms/FormOpenHandler';
import PensionForm from '../../forms/pensions/PensionForm';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { FormFields } from '../../models/FormProps';

const PensionRow = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const colSpan: number = 6;
  const queryClient = useQueryClient();
  const formFields: FormFields = {
    field: 'pension',
    custId: custId!,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['customer', formFields],
    queryFn: () => getCustomerFormData(formFields),

    onSuccess: (data) => {
      return data as [CustomerPension & DateFields];
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
              (data as [CustomerPension & DateFields])!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{f.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Bolag</TableCell>
                      <TableCell>Pensionstyp</TableCell>
                      <TableCell>Benämning</TableCell>
                      <TableCell>Värde</TableCell>
                      <TableCell>Pensionsålder</TableCell>
                      <TableCell>Utbet. Tid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.company || '-'}</TableCell>
                      <TableCell>{f.pensionType || '-'}</TableCell>
                      <TableCell>{f.pensionName || '-'}</TableCell>
                      <TableCell>
                        {f.pensionValue ? f.pensionValue.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.pensionAge || '-'}</TableCell>
                      <TableCell>
                        {f.compensationPeriod == 0
                          ? 'Livslång'
                          : f.compensationPeriod
                          ? f.compensationPeriod + ' år'
                          : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Gar.Pens. (kr/mån)</TableCell>
                      <TableCell>Skalavgift</TableCell>
                      <TableCell>Vägd riskklass</TableCell>
                      <TableCell>Vägd fondavg.</TableCell>
                      <TableCell>Ber. Värdeökn.</TableCell>
                      <TableCell>Sparande (år)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {f.monthlyPension ? f.monthlyPension.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.shellFee ? f.shellFee + '%' : '-'}</TableCell>
                      <TableCell>{f.riskClass ? f.riskClass + '%' : '-'}</TableCell>
                      <TableCell>{f.fundFee ? f.fundFee + '%' : '-'}</TableCell>
                      <TableCell>{f.estIncreasedValue ? f.estIncreasedValue + '%' : '-'}</TableCell>
                      <TableCell>
                        {f.annualSavings ? f.annualSavings.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ÅB-skydd</TableCell>
                      <TableCell>Eft.Skydd (kr/år)</TableCell>
                      <TableCell>Uttid (död)</TableCell>
                      <TableCell>Förmånstagare</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {f.commitmentPowers == true
                          ? 'Ja'
                          : f.commitmentPowers == false
                          ? 'Nej'
                          : '-'}
                      </TableCell>
                      <TableCell>{f.timeAfterDeath ? f.timeAfterDeath + ' år' : '-'}</TableCell>
                      <TableCell>
                        {f.spousalProtection ? f.spousalProtection.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.beneficiary || '-'}</TableCell>
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
                    Inga pensioner registrerade.
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
          <PensionForm formCount={formCount} setFormCount={(value) => setFormCount(value)} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default PensionRow;
