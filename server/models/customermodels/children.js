const { Schema } = require('mongoose');

const childSchema = new Schema(
  {
    name: { type: String },
    yearMonth: { type: String },
    belongs: { type: String },
    childSupportCounts: { type: Boolean },
    livesAtHomeToAge: { type: Number },
  },
  { timestamps: true }
);

module.exports = childSchema;
