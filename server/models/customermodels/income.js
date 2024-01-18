const { Schema } = require('mongoose');

const incomeBaseSchema = new Schema(
  {
    belongs: { type: String },
    values: {
      serviceIncome: { type: Number },
      ofWhichOwnAB: { type: Number },
      companyCarBenefit: { type: Boolean },
      soleTraderIncome: { type: Number },
      deficitOffset: { type: Boolean },
      taxFree: { type: Number },
      k10: {
        amount: { type: Number },
        distributionMonth: { type: Number },
        savedDistribution: { type: Number },
        financialStatementsMonth: { type: Number },
        salaryBasis: { type: Number },
        ownershipShare: { type: Number },
      },
    },
  },
  { timestamps: true }
);

const incomeChangeSchema = new Schema(
  {
    belongs: { type: String },
    values: {
      changeType: { type: String },
      when: { type: Number },
      newAmount: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = { incomeBaseSchema, incomeChangeSchema };
