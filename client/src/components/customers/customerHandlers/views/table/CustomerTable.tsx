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
import { CustomerOverview } from '../models/ViewCustomerModel';
import CustomerTableRow from './CustomerTableRow';
import CustomerDetailsRow from './expandedrows/details/CustomerDetailsRow';
import CustomerChildrenRow from './expandedrows/details/CustomerChildrenRow';
import BaseIncomeRow from './expandedrows/incomes/BaseIncomeRow';
import ChangeIncomeRow from './expandedrows/incomes/ChangeIncomeRow';
import { useEffect, useState } from 'react';
import NestedRow from './expandedrows/NestedRow';
import BaseExpenseRow from './expandedrows/expenses/BaseExpenseRow';
import InvestmentsRow from './expandedrows/savingsAndAssets/InvestmentsRow';
import BankFundsRow from './expandedrows/savingsAndAssets/BankFundsRow';
import BaseLiabilitiesRow from './expandedrows/liabilities/BaseLiabilitiesRow';
import PlannedLiabilitiesRow from './expandedrows/liabilities/PlannedLiabilitiesRow';
import AssetsRow from './expandedrows/savingsAndAssets/AssetsRow';
import PensionRow from './expandedrows/pensions/PensionRow';
import InsuranceSickRow from './expandedrows/insurances/InsuranceSickRow';
import PropertyInsuranceRow from './expandedrows/insurances/InsurancePropertyRow';
import InsuranceAccidentRow from './expandedrows/insurances/InsuranceAccidentRow';
import InsuranceLifeRow from './expandedrows/insurances/InsuranceDeathRow';
import SpousalPensionRow from './expandedrows/pensions/SpousalPensionRow';
import ChangeExpenseRow from './expandedrows/expenses/ChangeExpenseRow';

interface TableProps {
  customer: CustomerOverview;
}

const CustomerTable: React.FC<TableProps> = ({ customer }) => {
  const [currCustomer, setCurrCustomer] = useState<CustomerOverview>(customer);
  const [loading, setLoading] = useState(true);
  const [incomeLength, setIncomeLength] = useState<number>(0);
  const [expenseLength, setExpenseLength] = useState<number>(0);
  const [liabilitiesLength, setLiabilitiesLength] = useState<number>(0);
  const [insuranceLength, setInsuranceLength] = useState<number>(0);
  const { accident, sickness, life, work } = currCustomer.insurances;

  useEffect(() => {
    setCurrCustomer(customer);

    setExpenseLength(currCustomer.expenses.base.length + currCustomer.expenses.change.length);
    setIncomeLength(currCustomer.income.base.length + currCustomer.income.change.length);
    setLiabilitiesLength(
      currCustomer.liabilities.base.length + currCustomer.liabilities.planned.length
    );
    setInsuranceLength(
      accident.length + sickness.length + accident.length + life.length + work.length
    );

    setLoading(false);
    console.log('currCustomer', currCustomer);
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
                <CustomerDetailsRow />
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Barn'}
                fieldLength={currCustomer.customerChildren.length}>
                <CustomerChildrenRow />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Inkomster'} fieldLength={incomeLength}>
                <NestedRow fieldName={'Grund'} fieldLength={currCustomer.income.base.length}>
                  <BaseIncomeRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Planerade inkomstförändringar'}
                  fieldLength={currCustomer.income.change.length}>
                  <ChangeIncomeRow />
                </NestedRow>
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Utgifter'} fieldLength={expenseLength}>
                <NestedRow fieldName={'Grund'} fieldLength={currCustomer.expenses.base.length}>
                  <BaseExpenseRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Planerade utgifter'}
                  fieldLength={currCustomer.expenses.change.length | 0}>
                  <ChangeExpenseRow fields={currCustomer.expenses.change} />
                </NestedRow>
              </CustomerTableRow>

              <CustomerTableRow
                fieldName={'Sparande & placeringar'}
                fieldLength={currCustomer.investments.length | 0}>
                <InvestmentsRow fields={currCustomer.investments} />
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Bankmedel'}
                fieldLength={currCustomer.bankFunds.length | 0}>
                <BankFundsRow fields={currCustomer.bankFunds} />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Skulder'} fieldLength={liabilitiesLength}>
                <NestedRow
                  fieldName={'Grund'}
                  fieldLength={currCustomer.liabilities?.base?.length | 0}>
                  <BaseLiabilitiesRow fields={currCustomer.liabilities.base} />
                </NestedRow>
                <NestedRow
                  fieldName={'Framåtplanering skulder'}
                  fieldLength={currCustomer.liabilities?.planned?.length | 0}>
                  <PlannedLiabilitiesRow fields={currCustomer.liabilities.planned} />
                </NestedRow>
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Egendomar'} fieldLength={currCustomer.assets.length}>
                <AssetsRow fields={currCustomer.assets} />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Försäkringar'} fieldLength={insuranceLength}>
                <NestedRow
                  fieldName={'Egendomsförsäkringar'}
                  fieldLength={currCustomer.insurances.property.length}>
                  <PropertyInsuranceRow fields={currCustomer.insurances.property} />
                </NestedRow>
                <NestedRow
                  fieldName={'Olycksfallsförsäkringar'}
                  fieldLength={currCustomer.insurances.accident.length}>
                  <InsuranceAccidentRow fields={currCustomer.insurances.accident} />
                </NestedRow>
                <NestedRow
                  fieldName={'Sjuk- och olycksfallsförsäkringar'}
                  fieldLength={currCustomer.insurances.sickness.length}>
                  <InsuranceSickRow fields={currCustomer.insurances.sickness} />
                </NestedRow>
                <NestedRow
                  fieldName={'Livförsäkringar'}
                  fieldLength={currCustomer.insurances.life.length}>
                  <InsuranceLifeRow fields={currCustomer.insurances.life} />
                </NestedRow>
                <NestedRow
                  fieldName={'Avtalsenliga försäkringar'}
                  fieldLength={currCustomer.insurances.work.length}>
                  <></>
                </NestedRow>
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Efterlevandepensioner'}
                fieldLength={currCustomer.spousalPension.length}>
                <SpousalPensionRow fields={currCustomer.spousalPension} />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Pensioner'} fieldLength={currCustomer.pension.length}>
                <PensionRow fields={currCustomer.pension} />
              </CustomerTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CustomerTable;
