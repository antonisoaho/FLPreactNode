const { Schema } = require('mongoose');

const pensionSchema = new Schema(
  {
    belongs: { type: String },
    company: { type: String },
    pensionType: { type: String },
    pensionName: { type: String },
    pensionValue: { type: Number },
    pensionAge: { type: Number },
    monthlyPension: { type: Number },
    compensationPeriod: { type: String },
    altPaymentAge: { type: Number },
    impactPercent: { type: Number },
    shellFee: { type: Number },
    riskClass: { type: Number },
    fundFee: { type: Number },
    estIncreasedValue: { type: Number },
    annualSavings: { type: Number },
    commitmentPowers: { type: Boolean },
    beneficiary: { type: String },
  },
  { timestamps: true }
);

module.exports = pensionSchema;
