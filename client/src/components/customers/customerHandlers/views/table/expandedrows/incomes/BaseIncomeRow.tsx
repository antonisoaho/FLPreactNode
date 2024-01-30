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
import { IncomeBase } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  getCustomerFormData,
  deleteCustSubDocument,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import FormCountHandler from '../../../forms/FormCountHandler';
import TableLoader from '../../TableLoader';
import IncomeBaseForm from '../../../forms/incomes/IncomeBaseForm';

const BaseIncomeRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[IncomeBase & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 7;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'income',
      _id: custId as string,
      subField: 'base',
    });

    if (response.success) {
      setFields(response.data as [IncomeBase & DateFields]);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'income',
      custId: custId!,
      subDocId: subDocId,
      subField: 'base',
    });

    if (response.success) setFields(response.data as [IncomeBase & DateFields]);
  };

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
              fields!.map((inc) => (
                <React.Fragment key={inc._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{inc.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inc.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell />
                      <TableCell>Tjänsteink.</TableCell>
                      <TableCell>Varav eget AB</TableCell>
                      <TableCell>Tj. bilförmån</TableCell>
                      <TableCell>Löneavdragstyp</TableCell>
                      <TableCell>NE Inkomst</TableCell>
                      <TableCell>Skattefritt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                      <TableCell>{inc.values!.serviceIncome?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inc.values!.ofWhichOwnAB?.toLocaleString() || '-'}</TableCell>
                      <TableCell>
                        {inc.values!.companyCarBenefit?.amount?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        {inc.values!.companyCarBenefit?.gross === true
                          ? 'Brutto'
                          : inc.values!.companyCarBenefit?.gross === false
                          ? 'Netto'
                          : '-'}
                      </TableCell>
                      <TableCell>{inc.values?.soleTraderIncome || '-'}</TableCell>
                      <TableCell>{inc.values?.taxFree || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>K10 ut</TableCell>
                      <TableCell>Sparad utd.</TableCell>
                      <TableCell>Löneunderlag</TableCell>
                      <TableCell>Ägarandel</TableCell>

                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                      <TableCell>{inc.values?.k10?.amount?.toLocaleString() || '-'}</TableCell>
                      <TableCell>
                        {inc.values?.k10?.savedDistribution?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>{inc.values?.k10?.salaryBasis?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inc.values?.k10?.ownershipShare || '-'}</TableCell>
                      <TableCell />
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(inc._id)}>
                          Ta bort
                        </ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={colSpan}>Inga inkomster</TableCell>
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
          <IncomeBaseForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BaseIncomeRow;
