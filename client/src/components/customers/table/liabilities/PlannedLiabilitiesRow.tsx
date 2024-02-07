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
import { LiabilityPlanned } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import LiabilityPlannedForm from '../../forms/liabilities/LiabilityPlannedForm';
import FormCountHandler from '../../forms/FormCountHandler';

const PlannedLiabilitesRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[LiabilityPlanned & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 7;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'liabilities',
      custId: custId!,
      subDocId: subDocId,
      subField: 'planned',
    });

    if (response.success) {
      setFields(response.data as [LiabilityPlanned & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'liabilities',
      subField: 'planned',
      _id: custId as string,
    });
    if (response.success) {
      setFields(response.data as [LiabilityPlanned & DateFields]);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

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
                  <TableCell colSpan={colSpan}>
                    Ingen framåtplanering av skulder hittades registrerade.
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
          <LiabilityPlannedForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default PlannedLiabilitesRow;
