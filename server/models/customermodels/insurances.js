const { Schema } = require('mongoose');

const propertyInsuranceSchema = new Schema(
  {
    propertyType: { type: String },
    company: { type: String },
    expiryDate: { type: Date },
    premiumCost: { type: Number },
    paymentPeriod: { type: String },
    lastControl: { type: String },
  },
  { timestamps: true }
);

const sickInsuranceSchema = new Schema(
  {
    belongs: { type: String },
    company: { type: String },
    insuranceType: { type: String },
    taxFree: { type: Boolean },
    qualifyingPeriod: { type: String },
    compensationAmount: { type: Number },
    compensationPeriod: { type: String },
    premiumCost: { type: Number },
    expiryDate: { type: String },
    lastUpdated: { type: String },
  },
  { timestamps: true }
);

const accidentInsuranceSchema = new Schema(
  {
    belongs: { type: String },
    company: { type: String },
    insuranceType: { type: String },
    compensationAmount: { type: Number },
    premiumCost: { type: Number },
    expiryDate: { type: String },
    lastControl: { type: String },
  },
  { timestamps: true }
);

const lifeInsuranceSchema = new Schema(
  {
    belongs: { type: String },
    company: { type: String },
    insuranceType: { type: String },
    compensationAmount: { type: Number },
    premiumCost: { type: Number },
    expiryDate: { type: String },
    beneficiary: { type: String },
    lastControl: { type: String },
  },
  { timestamps: true }
);

const workInsuranceSchema = new Schema(
  {
    belongs: { type: String },
    insuranceType: { type: String },
  },
  { timestamps: true }
);

module.exports = {
  propertyInsuranceSchema,
  sickInsuranceSchema,
  lifeInsuranceSchema,
  accidentInsuranceSchema,
  workInsuranceSchema,
};
