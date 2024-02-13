const { Schema } = require('mongoose');

const bankFundSchema = new Schema(
  {
    belongs: { type: String },
    accountType: { type: String },
    institution: { type: String },
    name: { type: String },
    value: { type: Number },
    timePerspective: { type: String },
    monthlySavings: { type: Number },
    saveForHowLong: { type: Number },
    interestRate: { type: Number },
    projectedGrowth: { type: Number },
  },
  { timestamps: true }
);

module.exports = bankFundSchema;
