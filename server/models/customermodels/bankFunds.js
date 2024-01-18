const { Schema } = require('mongoose');

const bankFundSchema = new Schema(
  {
    belongs: { type: String },
    accounType: { type: String },
    institution: { type: String },
    name: { type: String },
    value: { type: Number },
    timePerspective: { type: String },
    monthlySavings: { type: Number },
  },
  { timestamps: true }
);

module.exports = bankFundSchema;
