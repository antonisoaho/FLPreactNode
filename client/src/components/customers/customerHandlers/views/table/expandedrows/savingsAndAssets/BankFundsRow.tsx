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
import { BankFund } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  getCustomerFormData,
  deleteCustSubDocument,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import BankFundForm from '../../../forms/savingsAndAssets/BankFundForm';

const BankFundsRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[BankFund & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const sortFieldsBelongs = () => {
    fields!.sort((a, b) => {
      if (a.belongs === 'Gemensamt') return -1;
      if (b.belongs === 'Gemensamt') return 1;

      return a.belongs! > b.belongs! ? 1 : -1;
    });
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'bankFunds',
      custId: custId!,
      subDocId: subDocId,
    });

    if (response.success) {
      setFields(response.data as [BankFund & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'bankFunds',
      _id: custId as string,
    });
    if (response.success) {
      setFields(response.data as [BankFund & DateFields]);
      if (fields) sortFieldsBelongs();
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
                      <TableCell>Kontotyp</TableCell>
                      <TableCell>Bank</TableCell>
                      <TableCell>Benämning/ID</TableCell>
                      <TableCell>Tidsperspektiv</TableCell>
                      <TableCell>Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{f.accountType || '-'}</TableCell>
                      <TableCell>{f.institution || '-'}</TableCell>
                      <TableCell>{f.name || f._id}</TableCell>
                      <TableCell>{f.timePerspective || '-'}</TableCell>
                      <TableCell>{f.value ? f.value.toLocaleString() + ' SEK' : '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Månadsspar</TableCell>
                      <TableCell>Spartid (år)</TableCell>
                      <TableCell>Ränta</TableCell>
                      <TableCell>Tänkt tillväxt</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {f.monthlySavings ? f.monthlySavings.toLocaleString() + ' SEK' : '-'}
                      </TableCell>
                      <TableCell>{f.saveForHowLong || '-'}</TableCell>
                      <TableCell>{f.interestRate ? f.interestRate + '%' : '-'}</TableCell>
                      <TableCell>{f.projectedGrowth ? f.projectedGrowth + '%' : '-'}</TableCell>
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
                    Inga bankmedel hittades regisrerade.
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
          <BankFundForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BankFundsRow;
