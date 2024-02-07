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
import { DateFields } from '../../../../services/api/models/ApiModel';
import { LiabilityBase } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import FormCountHandler from '../../forms/FormCountHandler';
import LiabilityBaseForm from '../../forms/liabilities/LiabilityBaseForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const BaseLiabilitiesRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[LiabilityBase & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'liabilities',
      custId: custId!,
      subDocId: subDocId,
      subField: 'base',
    });

    if (response.success) {
      setFields(response.data as [LiabilityBase & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'liabilities',
      subField: 'base',
      _id: custId as string,
    });
    if (response.success) {
      setFields(response.data as [LiabilityBase & DateFields]);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
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
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Lånetyp</TableCell>
                      <TableCell>Långivare</TableCell>
                      <TableCell>Benämning</TableCell>
                      <TableCell>Skuld</TableCell>
                      <TableCell>ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.loanType || 'Ospecificerat'}</TableCell>
                      <TableCell>{f.lender || '-'}</TableCell>
                      <TableCell>{f.name || '-'}</TableCell>
                      <TableCell>{f.debt ? f.debt.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>{f._id}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ränta</TableCell>
                      <TableCell>Amort. (kr/mån)</TableCell>
                      <TableCell>Räntebindning</TableCell>
                      <TableCell>Låneskydd?</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.interest ? f.interest + '%' : '-'}</TableCell>
                      <TableCell>
                        {f.monthlyAmortization
                          ? f.monthlyAmortization.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(f.lockInterestDate!).toLocaleDateString() || '-'}
                      </TableCell>
                      <TableCell>{f.loanProtection ? 'Ja' : 'Nej'}</TableCell>
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
                    Inga skulder hittades registrerade.
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
          <LiabilityBaseForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseLiabilitiesRow;
