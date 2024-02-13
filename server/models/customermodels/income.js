const { Schema } = require('mongoose');

const incomeBaseSchema = new Schema(
  {
    belongs: { type: String },
    serviceIncome: { type: Number },
    ofWhichOwnAB: { type: Number },
    companyCarBenefit: {
      amount: { type: Number },
      gross: { type: Boolean },
    },
    soleTraderIncome: { type: Number },
    taxFree: { type: Number },
    k10: {
      amount: { type: Number },
      savedDistribution: { type: Number },
      salaryBasis: { type: Number },
      ownershipShare: { type: Number },
    },
  },
  { timestamps: true }
);

const incomeChangeSchema = new Schema(
  {
    belongs: { type: String },
    changeType: { type: String },
    when: { type: Number },
    newAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = { incomeBaseSchema, incomeChangeSchema };
