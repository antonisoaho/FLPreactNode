const { Schema } = require('mongoose');

const liabilityBaseSchema = new Schema(
  {
    loanType: { type: String },
    lender: { type: String },
    name: { type: String },
    belongs: {
      type: String,
      required: function () {
        return this.baseValues.loanType != null;
      },
    },
    debt: {
      type: Number,
      required: function () {
        return this.baseValues.loanType != null;
      },
    },
    interest: {
      type: Number,
      required: function () {
        return this.baseValues.loanType != null;
      },
    },
    monthlyAmortization: {
      type: Number,
      required: function () {
        return this.baseValues.loanType != null;
      },
    },
    loanProtection: {
      death: { type: Boolean },
      sickness: { type: Boolean },
      unemployment: { type: Boolean },
      maximumAmount: { type: Number },
    },
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
