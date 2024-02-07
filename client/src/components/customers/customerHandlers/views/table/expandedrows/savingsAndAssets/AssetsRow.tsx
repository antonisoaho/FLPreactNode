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
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { Assets } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import AssetsForm from '../../../forms/savingsAndAssets/AssetsForm';

const AssetsRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[Assets & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'assets',
      custId: custId!,
      subDocId: subDocId,
    });

    if (response.success) {
      setFields(response.data as [Assets & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'assets',
      _id: custId as string,
    });
    if (response.success) {
      (response!.data as [Assets & DateFields]).sort((a, b) => {
        if (a.belongs === 'Gemensamt') return -1;
        if (b.belongs === 'Gemensamt') return 1;

        return a.belongs! > b.belongs! ? 1 : -1;
      });

      setFields(response.data as [Assets & DateFields]);
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
                <React.Fragment key={f._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{f.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Tillgångstyp</TableCell>
                      <TableCell>Benämning/ID</TableCell>
                      <TableCell>Värde</TableCell>
                      <TableCell>Insats</TableCell>
                      <TableCell>Pantbrev</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.assetType || '-'}</TableCell>
                      <TableCell>{f.name || f._id}</TableCell>
                      <TableCell>{f.value ? f.value.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>{f.stake ? f.stake.toLocaleString() + ' SEK' : '-'}</TableCell>
                      <TableCell>
                        {f.mortgageDeed ? f.mortgageDeed.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Värderingsår</TableCell>
                      <TableCell>Skatt</TableCell>
                      <TableCell>Taxeringsvärde</TableCell>
                      <TableCell>Rot</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.valueYear?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{f.tax ? f.tax + '%' : '-'}</TableCell>
                      <TableCell>
                        {f.assessedValue ? f.assessedValue.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.base ? f.base.toLocaleString() + ' SEK' : '-'}</TableCell>
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
                  <TableCell colSpan={colSpan}>Inga tillgångar hittades registrerade.</TableCell>
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
          <AssetsForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default AssetsRow;
