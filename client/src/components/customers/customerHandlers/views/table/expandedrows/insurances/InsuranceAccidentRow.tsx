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
import { InsuranceAccident } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import AccidentInsuranceForm from '../../../forms/insurances/AccidentInsuranceForm';

const InsuranceAccidentRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[InsuranceAccident & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 7;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'insurances',
      custId: custId!,
      subField: 'accident',
      subDocId: subDocId,
    });

    if (response.success) {
      setFields(response.data as [InsuranceAccident & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'insurances',
      _id: custId as string,
      subField: 'accident',
    });
    if (response.success) {
      setFields(response.data as [InsuranceAccident & DateFields]);
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
                      <TableCell>Benämning</TableCell>
                      <TableCell>Ersättning</TableCell>
                      <TableCell>Premie</TableCell>
                      <TableCell>Förfallodag</TableCell>
                      <TableCell>Senast kontroll</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.company || '-'}</TableCell>
                      <TableCell>{f.insuranceType || '-'}</TableCell>
                      <TableCell>
                        {f.compensationAmount
                          ? f.compensationAmount.toLocaleString() + ' SEK'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {f.premiumCost ? f.premiumCost.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>
                        {f.expiryDate ? new Date(f.expiryDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {f.lastControl ? new Date(f.lastControl).toLocaleDateString() : '-'}
                      </TableCell>
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
                    Inga olycksförsäkringar hittades registrerade.
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
          <AccidentInsuranceForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsuranceAccidentRow;
