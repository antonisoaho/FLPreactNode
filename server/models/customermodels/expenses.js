const { Schema } = require('mongoose');

const expensesBaseSchema = new Schema(
  {
    values: {
      expenseType: { type: String },
      mapped: { type: Number },
      correction: { type: Number },
      difCrisis: { type: Number },
      difPension: { type: Number },
      difActiveEnd: { type: Number },
      difDeath: [{ type: Number }],
      childMovesOut: { type: Number },
    },
  },
  { timestamps: true }
);

const expensesChangeSchema = new Schema(
  {
    values: {
      changeType: { type: String },
      when: { type: Number },
      ongoing: { type: Number },
      value: { type: Number },
      comment: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = { expensesChangeSchema, expensesBaseSchema };
