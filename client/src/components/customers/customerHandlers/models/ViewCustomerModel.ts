import { DateFields } from '../../../../apiCalls/models/ApiModel';
import {
  Assets,
  BankFund,
  CustomerChildren,
  CustomerDetails,
  CustomerPension,
  ExpensesBase,
  ExpensesChange,
  IncomeBase,
  IncomeChange,
  InsuranceAccident,
  InsuranceLife,
  InsuranceProperty,
  InsuranceSickness,
  InsuranceWork,
  Investment,
  LiabilityBase,
  LiabilityPlanned,
  SpousalPension,
} from '../edit/forms/models/CustomerFormModels';

export type CustomerOverview = {
  _id: string;
  advisor: string;
  customerDetails: [CustomerDetails & DateFields];
  customerChildren: [CustomerChildren & DateFields];
  income: {
    base: [IncomeBase & DateFields];
    change: [IncomeChange & DateFields];
  };
  expenses: {
    base: [ExpensesBase & DateFields];
    change: [ExpensesChange & DateFields];
  };
  investments: [Investment & DateFields];
  bankFunds: [BankFund & DateFields];
  liabilities: {
    base: [LiabilityBase & DateFields];
    planned: [LiabilityPlanned & DateFields];
  };
  assets: [Assets & DateFields];
  insurances: {
    property: [InsuranceProperty & DateFields];
    sickness: [InsuranceSickness & DateFields];
    accident: [InsuranceAccident & DateFields];
    life: [InsuranceLife & DateFields];
    work: [InsuranceWork & DateFields];
  };
  pension: [CustomerPension & DateFields];
  spousalPension: [SpousalPension & DateFields];
  createdAt: Date;
  updatedAt: Date;
};
