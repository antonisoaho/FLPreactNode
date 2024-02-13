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
    compensationPeriod: { type: Number },
    shellFee: { type: Number },
    riskClass: { type: Number },
    fundFee: { type: Number },
    estIncreasedValue: { type: Number },
    annualSavings: { type: Number },
    commitmentPowers: { type: Boolean },
    spousalProtection: { type: Number },
    timeAfterDeath: { type: Number },
    beneficiary: { type: String },
  },
  { timestamps: true }
);

const spousalPensionSchema = new Schema(
  {
    belongs: { type: String },
    company: { type: String },
    taxFree: { type: Boolean },
    compensation: { type: Number },
    compensationPeriod: { type: String },
    premiumCost: { type: Number },
    beneficiary: { type: String },
  },
  { timestamps: true }
);

module.exports = { pensionSchema, spousalPensionSchema };
