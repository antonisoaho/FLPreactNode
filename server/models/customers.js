const { Schema, model } = require('mongoose');

const customerDetailsSchema = require('./customerModels/details');
const childSchema = require('./customerModels/children');
const workConditionsSchema = require('./customerModels/workConditions');
const { incomeBaseSchema, incomeChangeSchema } = require('./customerModels/income');
const { expensesBaseSchema, expensesChangeSchema } = require('./customerModels/expenses');
const bankFundSchema = require('./customerModels/bankFunds');
const investmentSchema = require('./customerModels/investments');
const { liabilityBaseSchema, liabilityPlannedSchema } = require('./customerModels/liabilities');
const assetSchema = require('./customerModels/assets');
const {
  propertyInsuranceSchema,
  sickInsuranceSchema,
  accidentInsuranceSchema,
  lifeInsuranceSchema,
  workInsuranceSchema,
} = require('./customerModels/insurances');
const { pensionSchema, spousalPensionSchema } = require('./customerModels/pension');

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
module.exports = { Customer };
