import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import { CustomerOverview } from '../../models/ViewCustomerModel';
import CustomerTableRow from './CustomerTableRow';
import CustomerDetailsRow from './expandedrows/CustomerDetailsRow';
import CustomerChildrenRow from './expandedrows/CustomerChildrenRow';
import BaseIncomeRow from './expandedrows/BaseIncomeRow';
import ChangeIncomeRow from './expandedrows/ChangeIncomeRow';
import { useEffect, useState } from 'react';
import NestedRow from './expandedrows/NestedRow';
import BaseExpenseRow from './expandedrows/BaseExpenseRow';

interface TableProps {
  customer: CustomerOverview;
}

const CustomerTable: React.FC<TableProps> = ({ customer }) => {
  const [currCustomer, setCurrCustomer] = useState<CustomerOverview>(customer);
  const [loading, setLoading] = useState(true);
  const [incomeLength, setIncomeLength] = useState<number>(0);
  const [expenseLength, setExpenseLength] = useState<number>(0);

  useEffect(() => {
    setCurrCustomer(customer);

    setExpenseLength(currCustomer.expenses.base.length + currCustomer.expenses.change.length);
    setIncomeLength(currCustomer.income.base.length + currCustomer.income.change.length);
    setLoading(false);
    console.log('customer', customer);
  }, [customer]);

  return (
    <>
      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontSize: '16px' }}>Grundfakta</TableCell>
                <TableCell align="right" sx={{ fontSize: '16px' }}>
                  Antal ifyllt
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <CustomerTableRow
                fieldName="Kundinformation"
                fieldLength={currCustomer.customerDetails.length}>
                <CustomerDetailsRow fields={currCustomer.customerDetails} />
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Barn'}
                fieldLength={currCustomer.customerChildren.length}>
                <CustomerChildrenRow fields={currCustomer.customerChildren} />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Inkomster'} fieldLength={incomeLength}>
                <NestedRow fieldName={'Grund'} fieldLength={currCustomer.income.base.length}>
                  <BaseIncomeRow fields={currCustomer.income.base} />
                </NestedRow>
                <NestedRow
                  fieldName={'Planerade inkomstförändringar'}
                  fieldLength={currCustomer.income.change.length}>
                  <ChangeIncomeRow fields={currCustomer.income.change} />
                </NestedRow>
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Utgifter'} fieldLength={expenseLength}>
                <NestedRow fieldName={'Grund'} fieldLength={currCustomer.income.change.length}>
                  <BaseExpenseRow
                    fields={currCustomer.expenses.base}
                    persons={Array.from(
                      (currCustomer.customerDetails || []).map(({ name }) => name as string)
                    )}
                  />
                </NestedRow>
                <NestedRow
                  fieldName={'Planerade utgifter'}
                  fieldLength={currCustomer.expenses.change.length | 0}>
                  <ChangeIncomeRow fields={currCustomer.expenses.change} />
                </NestedRow>
              </CustomerTableRow>

              <CustomerTableRow
                fieldName={'Sparande & placeringar'}
                fieldLength={currCustomer.investments.length | 0}>
                <></>
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Bankmedel'}
                fieldLength={currCustomer.bankFunds.length | 0}>
                <></>
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Skulder'}
                fieldLength={currCustomer.liabilities?.base?.length | 0}>
                <NestedRow
                  fieldName={'Grund'}
                  fieldLength={currCustomer.liabilities?.base?.length | 0}>
                  <></>
                </NestedRow>
                <NestedRow
                  fieldName={'Framåtplanering skulder'}
                  fieldLength={currCustomer.liabilities?.planned?.length | 0}>
                  <></>
                </NestedRow>
              </CustomerTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CustomerTable;
