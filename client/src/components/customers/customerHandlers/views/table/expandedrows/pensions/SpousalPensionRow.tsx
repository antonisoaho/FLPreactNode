import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { SpousalPension } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import SpousalPensionForm from '../../../forms/pensions/SpousalPensionForm';

const SpousalPensionRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[SpousalPension & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 7;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'spousalPension',
      custId: custId!,
      subDocId: subDocId,
    });

    if (response.success) {
      setFields(response.data as [SpousalPension & DateFields]);
    }
  };

  const updateCustomerFields = useCallback(async () => {
    const response = await getCustomerFormData({
      field: 'spousalPension',
      _id: custId as string,
    });
    if (response.success) {
      setFields(response.data as [SpousalPension & DateFields]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateCustomerFields();
  }, [custId, updateCustomerFields]);

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
              fields!.map((f) => (
                <Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{f.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Bolag</TableCell>
                      <TableCell>Skattekategori</TableCell>
                      <TableCell>Ersättning</TableCell>
                      <TableCell>Utbet. Tid</TableCell>
                      <TableCell>Premie</TableCell>
                      <TableCell>Förmånstagare</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.company || '-'}</TableCell>
                      <TableCell>
                        {f.taxFree === true
                          ? 'Skattefri'
                          : f.taxFree === false
                          ? 'Skattepliktig'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {f.compensation ? f.compensation.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {f.compensationPeriod ? f.compensationPeriod + ' år' : '-'}
                      </TableCell>
                      <TableCell>{f.premiumCost ? f.premiumCost.toLocaleString() : '-'}</TableCell>
                      <TableCell>{f.beneficiary || '-'}</TableCell>
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
                  <TableCell colSpan={colSpan}>Inga efterlevandepensioner registrerade.</TableCell>
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
          <SpousalPensionForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default SpousalPensionRow;
