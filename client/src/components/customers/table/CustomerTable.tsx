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
import CustomerDetailsRow from './details/CustomerDetailsRow';
import CustomerChildrenRow from './details/CustomerChildrenRow';
import BaseIncomeRow from './incomes/BaseIncomeRow';
import ChangeIncomeRow from './incomes/ChangeIncomeRow';
import { useEffect, useState } from 'react';
import NestedRow from './NestedRow';
import BaseExpenseRow from './expenses/BaseExpenseRow';
import InvestmentsRow from './savingsAndAssets/InvestmentsRow';
import BankFundsRow from './savingsAndAssets/BankFundsRow';
import BaseLiabilitiesRow from './liabilities/BaseLiabilitiesRow';
import PlannedLiabilitiesRow from './liabilities/PlannedLiabilitiesRow';
import AssetsRow from './savingsAndAssets/AssetsRow';
import PensionRow from './pensions/PensionRow';
import InsuranceSickRow from './insurances/InsuranceSickRow';
import PropertyInsuranceRow from './insurances/InsurancePropertyRow';
import InsuranceAccidentRow from './insurances/InsuranceAccidentRow';
import InsuranceLifeRow from './insurances/InsuranceLifeRow';
import SpousalPensionRow from './pensions/SpousalPensionRow';
import ChangeExpenseRow from './expenses/ChangeExpenseRow';
import InsuranceWorkRow from './insurances/InsuranceWorkRow';

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
                  <ChangeExpenseRow />
                </NestedRow>
              </CustomerTableRow>

              <CustomerTableRow
                fieldName={'Sparande & placeringar'}
                fieldLength={currCustomer.investments.length | 0}>
                <InvestmentsRow />
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Bankmedel'}
                fieldLength={currCustomer.bankFunds.length | 0}>
                <BankFundsRow />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Skulder'} fieldLength={liabilitiesLength}>
                <NestedRow
                  fieldName={'Grund'}
                  fieldLength={currCustomer.liabilities?.base?.length | 0}>
                  <BaseLiabilitiesRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Framåtplanering skulder'}
                  fieldLength={currCustomer.liabilities?.planned?.length | 0}>
                  <PlannedLiabilitiesRow />
                </NestedRow>
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Egendomar'} fieldLength={currCustomer.assets.length}>
                <AssetsRow />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Försäkringar'} fieldLength={insuranceLength}>
                <NestedRow
                  fieldName={'Egendomsförsäkringar'}
                  fieldLength={currCustomer.insurances.property.length}>
                  <PropertyInsuranceRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Personförsäkringar Sjukdom'}
                  fieldLength={currCustomer.insurances.sickness.length}>
                  <InsuranceSickRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Avtalsenliga försäkringar'}
                  fieldLength={currCustomer.insurances.work.length}>
                  <InsuranceWorkRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Olycksfall'}
                  fieldLength={currCustomer.insurances.accident.length}>
                  <InsuranceAccidentRow />
                </NestedRow>
                <NestedRow
                  fieldName={'Livförsäkringar'}
                  fieldLength={currCustomer.insurances.life.length}>
                  <InsuranceLifeRow />
                </NestedRow>
              </CustomerTableRow>
              <CustomerTableRow
                fieldName={'Efterlevandepensioner'}
                fieldLength={currCustomer.spousalPension.length}>
                <SpousalPensionRow />
              </CustomerTableRow>
              <CustomerTableRow fieldName={'Pensioner'} fieldLength={currCustomer.pension.length}>
                <PensionRow />
              </CustomerTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CustomerTable;
