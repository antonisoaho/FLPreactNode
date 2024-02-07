const { Schema } = require('mongoose');

const investmentSchema = new Schema(
  {
    investmentType: { type: String },
    institution: { type: String },
    name: { type: String },
    belongs: { type: String },
    depositedAmount: { type: Number },
    value: { type: Number },
    riskClass: { type: Number },
    charge: { type: Number },
    timePerspective: { type: String },
    monthlySavings: { type: Number },
    saveForHowLong: { type: Number },
    projectedGrowth: { type: Number },
    additionalInvestment: { type: Number },
    when: { type: Number },
  },
  { timestamps: true }
);

module.exports = investmentSchema;
