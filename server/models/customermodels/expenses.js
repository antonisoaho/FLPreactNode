const { Schema } = require('mongoose');

const expensesBaseSchema = new Schema(
  {
    expenseType: { type: String },
    mapped: { type: Number },
    pension: [Number],
    activeEnd: [Number],
    difPension: [Number],
    difActiveEnd: [Number],
    difDeath: [Number],
  },
  { timestamps: true }
);

const expensesChangeSchema = new Schema(
  {
    changeType: { type: String },
    when: { type: Number },
    ongoing: { type: Number },
    value: { type: Number },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = { expensesChangeSchema, expensesBaseSchema };
