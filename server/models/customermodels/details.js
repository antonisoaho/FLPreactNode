const { Schema } = require('mongoose');

const customerDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    yearMonth: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = customerDetailsSchema;
