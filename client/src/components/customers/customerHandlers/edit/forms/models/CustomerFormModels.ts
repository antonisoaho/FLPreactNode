export type CustomerDetails = {
  name: string;
  yearMonth: string;
  status: string;
};

export type CustomerChildren = {
  name: string;
  yearMonth: string;
  belongs: string;
  childSupportCounts: boolean;
  livesAtHomeToAge: number;
};

export type IncomeBase = {
  belongs: string;
  values: {
    serviceIncome: number;
    ofWhichOwnAB?: number;
    companyCarBenefit?: {
      amount: number;
      gross: boolean;
    };
    soleTraderIncome?: number;
    taxFree?: number;
    k10?: {
      amount: number;
      savedDistribution: number;
      salaryBasis: number;
      ownershipShare: number;
    };
  };
};

export type IncomeChange = {
  belongs: string;
  values: {
    changeType: string;
    when: number;
    newAmount: number;
  };
};

export type ExpensesBase = {
  values: {
    expenseType: string;
    mapped: number;
    correction?: number;
    difPension: [number];
    difActiveEnd: [number];
    difDeath: [number];
  };
};

export type ExpensesChange = {
  values: {
    changeType: string;
    when: number;
    ongoing: number;
    value: number;
    comment?: string;
  };
};

export type Investment = {
  institution: string;
  name: string;
  belongs: string;
  depositedAmount: number;
  value: number;
  riskClass?: number;
  timePerspective: string;
  monthlySavings?: number;
  saveForHowLong: number;
  projectedGrowth: number;
};

export type BankFund = {
  belongs: string;
  accounType: string;
  institution: string;
  name?: string;
  value: number;
  timePerspective: string;
  monthlySavings?: number;
};

export type LiabilityBase = {
  loanType: string;
  lender: string;
  name: string;
  belongs: string;
  debt: number;
  interest: number;
  monthlyAmortization: number;
  loanProtection: boolean;
};

export type LiabilityPlanned = {
  loanType: string;
  event: string;
  when: string;
  amount: number;
  interest: number;
};

export type Assets = {
  assetType: string;
  name: string;
  value: number;
  stake: number;
  mortgageDeed: number;
  valueYear: number;
  belongs: string;
  tax: number;
  assessedValue: number;
  investment: number;
};

export type CustomerPension = {
  belongs: string;
  company: string;
  pensionType: string;
  pensionName: string;
  pensionValue: number;
  pensionAge: number;
  monthlyPension: number;
  compensationPeriod: string;
  shellFee: number;
  riskClass: number;
  fundFee: number;
  estIncreasedValue: number;
  annualSavings: number;
  commitmentPowers: boolean;
  beneficiary: string;
};

export type InsuranceProperty = {
  propertyType: string;
  company: string;
  expiryDate: Date;
  premiumCost: number;
  paymentPeriod: string;
  lastControl: string;
};

export type InsuranceSickness = {
  belongs: string;
  company: string;
  insuranceType: string;
  taxCategory: string;
  qualifyingPeriod: string;
  compensationAmount: number;
  compensationPeriod: string;
  premiumCost: number;
  expiryDate: string;
  lastUpdated: string;
};

export type InsuranceAccident = {
  belongs: string;
  company: string;
  insuranceType: string;
  compensationAmount: number;
  premiumCost: number;
  expiryDate: string;
  lastControl: string;
};

export type InsuranceDeath = {
  belongs: string;
  company: string;
  insuranceType: string;
  compensationAmount: number;
  premiumCost: number;
  expiryDate: string;
  beneficiary: string;
  lastControl: string;
};

export type InsuranceWork = {
  belongs: string;
  insuranceType: string;
};

type Insurances =
  | InsuranceProperty
  | InsuranceAccident
  | InsuranceDeath
  | InsuranceSickness
  | InsuranceWork;

export type CustomerFormData =
  | CustomerDetails
  | Insurances
  | CustomerPension
  | Assets
  | LiabilityPlanned
  | LiabilityBase
  | ExpensesChange
  | ExpensesBase
  | IncomeChange
  | IncomeBase
  | CustomerChildren
  | BankFund;
