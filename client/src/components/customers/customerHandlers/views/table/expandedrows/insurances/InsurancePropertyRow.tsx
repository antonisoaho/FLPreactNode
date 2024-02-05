import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { InsuranceProperty } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';

const InsurancePropertyRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[InsuranceProperty & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 4;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'insurances',
      custId: custId!,
      subField: 'life',
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
  }, [custId]);
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((f) => (
              <React.Fragment key={f._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>Försäkringstyp</TableCell>
                    <TableCell>Bolag</TableCell>
                    <TableCell>Förfallodag</TableCell>
                    <TableCell>Premie</TableCell>
                    <TableCell>Betalning</TableCell>
                    <TableCell>Senast kontroll</TableCell>
                    <TableCell align="right">Uppdaterad</TableCell>
                  </ColoredTableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.propertyType || '-'}</TableCell>
                    <TableCell>{f.company || '-'}</TableCell>
                    <TableCell>{new Date(f.expiryDate!).toLocaleDateString() || '-'}</TableCell>
                    <TableCell>{f.premiumCost?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.paymentPeriod || '-'}</TableCell>
                    <TableCell>{f.lastControl || '-'}</TableCell>
                    <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </React.Fragment>
            ))}
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default InsurancePropertyRow;
