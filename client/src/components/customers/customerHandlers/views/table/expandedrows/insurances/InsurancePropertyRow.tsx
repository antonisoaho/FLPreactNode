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
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { InsuranceProperty } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import PropertyInsuranceForm from '../../../forms/insurances/PropertyInsuranceForm';

const InsurancePropertyRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[InsuranceProperty & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 6;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'insurances',
      custId: custId!,
      subField: 'property',
      subDocId: subDocId,
    });

    if (response.success) {
      setFields(response.data as [InsuranceProperty & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'insurances',
      _id: custId as string,
      subField: 'property',
    });
    if (response.success) {
      setFields(response.data as [InsuranceProperty & DateFields]);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId, updateCustomerFields]);
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
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsurancePropertyRow;
