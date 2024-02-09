import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { CustomerOverview } from '../models/ViewCustomerModel';
import CustomerTableRow from './CustomerTableRow';
import CustomerDetailsRow from './details/CustomerDetailsRow';
import CustomerChildrenRow from './details/CustomerChildrenRow';
import BaseIncomeRow from './incomes/BaseIncomeRow';
import ChangeIncomeRow from './incomes/ChangeIncomeRow';
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
  const expenseLength: number = customer.expenses.base.length + customer.expenses.change.length;
  const incomeLength: number = customer.income.base.length + customer.income.change.length;
  const liabilitiesLength: number =
    customer.liabilities.base.length + customer.liabilities.planned.length;
  const insuranceLength: number = customer!.insurances
    ? Object.values(customer.insurances).reduce((totalLength, insuranceArray) => {
        return totalLength + insuranceArray.length;
      }, 0)
    : 0;

  return (
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
            fieldLength={customer.customerDetails.length}>
            <CustomerDetailsRow />
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Barn'} fieldLength={customer.customerChildren.length}>
            <CustomerChildrenRow />
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Inkomster'} fieldLength={incomeLength}>
            <NestedRow fieldName={'Grund'} fieldLength={customer.income.base.length}>
              <BaseIncomeRow />
            </NestedRow>
            <NestedRow
              fieldName={'Planerade inkomstförändringar'}
              fieldLength={customer.income.change.length}>
              <ChangeIncomeRow />
            </NestedRow>
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Utgifter'} fieldLength={expenseLength}>
            <NestedRow fieldName={'Grund'} fieldLength={customer.expenses.base.length}>
              <BaseExpenseRow />
            </NestedRow>
            <NestedRow
              fieldName={'Planerade utgifter'}
              fieldLength={customer.expenses.change.length | 0}>
              <ChangeExpenseRow />
            </NestedRow>
          </CustomerTableRow>

          <CustomerTableRow
            fieldName={'Sparande & placeringar'}
            fieldLength={customer.investments.length | 0}>
            <InvestmentsRow />
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Bankmedel'} fieldLength={customer.bankFunds.length | 0}>
            <BankFundsRow />
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Skulder'} fieldLength={liabilitiesLength}>
            <NestedRow fieldName={'Grund'} fieldLength={customer.liabilities?.base?.length | 0}>
              <BaseLiabilitiesRow />
            </NestedRow>
            <NestedRow
              fieldName={'Framåtplanering skulder'}
              fieldLength={customer.liabilities?.planned?.length | 0}>
              <PlannedLiabilitiesRow />
            </NestedRow>
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Egendomar'} fieldLength={customer.assets.length}>
            <AssetsRow />
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Försäkringar'} fieldLength={insuranceLength}>
            <NestedRow
              fieldName={'Egendomsförsäkringar'}
              fieldLength={customer.insurances.property.length}>
              <PropertyInsuranceRow />
            </NestedRow>
            <NestedRow
              fieldName={'Personförsäkringar Sjukdom'}
              fieldLength={customer.insurances.sickness.length}>
              <InsuranceSickRow />
            </NestedRow>
            <NestedRow
              fieldName={'Avtalsenliga försäkringar'}
              fieldLength={customer.insurances.work.length}>
              <InsuranceWorkRow />
            </NestedRow>
            <NestedRow fieldName={'Olycksfall'} fieldLength={customer.insurances.accident.length}>
              <InsuranceAccidentRow />
            </NestedRow>
            <NestedRow fieldName={'Livförsäkringar'} fieldLength={customer.insurances.life.length}>
              <InsuranceLifeRow />
            </NestedRow>
          </CustomerTableRow>
          <CustomerTableRow
            fieldName={'Efterlevandepensioner'}
            fieldLength={customer.spousalPension.length}>
            <SpousalPensionRow />
          </CustomerTableRow>
          <CustomerTableRow fieldName={'Pensioner'} fieldLength={customer.pension.length}>
            <PensionRow />
          </CustomerTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerTable;
