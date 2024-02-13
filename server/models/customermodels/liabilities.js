const { Schema } = require('mongoose');

const liabilityBaseSchema = new Schema(
  {
    loanType: { type: String },
    lender: { type: String },
    name: { type: String },
    belongs: { type: String },
    debt: { type: Number },
    interest: { type: Number },
    monthlyAmortization: { type: Number },
    lockInterestDate: { type: Date },
    loanProtection: { type: Boolean },
  },
  { timestamps: true }
);

const liabilityPlannedSchema = new Schema(
  {
    loanType: { type: String },
    event: { type: String },
    when: { type: Number },
    amount: { type: Number },
    interest: { type: Number },
  },
  { timestamps: true }
);

module.exports = { liabilityPlannedSchema, liabilityBaseSchema };
