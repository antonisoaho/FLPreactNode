const { Schema } = require('mongoose');

const workConditionSchema = new Schema(
  {
    belongs: { type: String },
    pensionAge: {
      type: Number,
      required: true,
      default: 65,
    },
    activeTimeEnd: {
      type: Number,
      required: true,
      default: 85,
    },
    lifeSpan: {
      type: Number,
      required: true,
      default: 90,
    },
    sickPay: {
      type: Boolean,
      required: true,
      default: false,
    },
    occupation: { type: String, required: true },
    collectiveAgreement: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = workConditionSchema;
