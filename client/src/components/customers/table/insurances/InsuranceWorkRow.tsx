import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DateFields } from '../../../../services/api/models/ApiModel';
import { InsuranceWork } from '../../models/CustomerFormModels';
import ColoredTableRow from '../../../ui/coloredTableRow/ColoredTableRow';
import FormCountHandler from '../../forms/FormCountHandler';
import WorkInsuranceForm from '../../forms/insurances/WorkInsuranceForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../services/api/apiCustomerCalls';
import { useParams } from 'react-router-dom';

const InsuranceWorkRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[InsuranceWork & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 6;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'insurances',
      custId: custId!,
      subDocId: subDocId,
      subField: 'work',
    });

    if (response.success) {
      setFields(response.data as [InsuranceWork & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'insurances',
      _id: custId as string,
      subField: 'work',
    });
    if (response.success) {
      setFields(response.data as [InsuranceWork & DateFields]);
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
            {loading ? (
              <TableBody>
                <TableLoader colSpan={colSpan} />
              </TableBody>
            ) : fields!.length > 0 ? (
              fields!.map((f) => (
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
          <WorkInsuranceForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsuranceWorkRow;
