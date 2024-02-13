const { Schema } = require('mongoose');

const assetSchema = new Schema(
  {
    assetType: { type: String },
    name: { type: String },
    value: { type: Number },
    stake: { type: Number },
    mortgageDeed: { type: Number },
    valueYear: { type: Number },
    belongs: { type: String },
    tax: { type: Number },
    assessedValue: { type: Number }, // Taxeringsvärde
    base: { type: Number },
  },
  { timestamps: true }
);

module.exports = assetSchema;
