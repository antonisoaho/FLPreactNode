const { Schema } = require('mongoose');

const investmentSchema = new Schema(
  {
    investmentType: { type: String },
    institution: { type: String },
    name: { type: String },
    belongs: {
      type: String,
      required: function () {
        return this.investmentType != null;
      },
    },
    depositedAmount: {
      type: Number,
      required: function () {
        return this.investmentType != null;
      },
    },
    value: {
      type: Number,
      required: function () {
        return this.investmentType != null;
      },
    },
    riskClass: { type: Number },
    charge: { type: Number },
    timePerspective: { type: Number },
    monthlySavings: { type: Number },
    saveForHowLong: { type: Number },
    projectedGrowth: { type: Number },
  },
  { timestamps: true }
);

module.exports = investmentSchema;
