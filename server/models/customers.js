const childSchema = require('./customermodels/children');
const customerDetailsSchema = require('./customermodels/details');
const workConditionsSchema = require('./customermodels/workConditions');
const { incomeBaseSchema, incomeChangeSchema } = require('./customermodels/income');
const { expensesBaseSchema, expensesChangeSchema } = require('./customermodels/expenses');
const bankFundSchema = require('./customermodels/bankFunds');
const investmentSchema = require('./customermodels/investments');
const { liabilityBaseSchema, liabilityPlannedSchema } = require('./customermodels/liabilities');
const assetSchema = require('./customermodels/assets');
const {
  propertyInsuranceSchema,
  sickInsuranceSchema,
  accidentInsuranceSchema,
  lifeInsuranceSchema,
  workInsuranceSchema,
} = require('./customermodels/insurances');
const { pensionSchema, spousalPensionSchema } = require('./customermodels/pension');

const { Schema, model } = require('mongoose');

const customerSchema = new Schema(
  {
    advisor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerDetails: [customerDetailsSchema],
    customerChildren: [childSchema],
    workConditions: [workConditionsSchema],
    income: {
      base: [incomeBaseSchema],
      change: [incomeChangeSchema],
    },
    expenses: {
      base: [expensesBaseSchema],
      change: [expensesChangeSchema],
    },
    bankFunds: [bankFundSchema],
    investments: [investmentSchema],
    liabilities: {
      base: [liabilityBaseSchema],
      planned: [liabilityPlannedSchema],
    },
    assets: [assetSchema],
    insurances: {
      property: [propertyInsuranceSchema],
      sickness: [sickInsuranceSchema],
      accident: [accidentInsuranceSchema],
      life: [lifeInsuranceSchema],
      work: [workInsuranceSchema],
    },
    pension: [pensionSchema],
    spousalPension: [spousalPensionSchema],
  },
  { timestamps: true }
);

const Customer = model('Customer', customerSchema);
module.exports = Customer;
