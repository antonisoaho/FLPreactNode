const { Schema } = require('mongoose');

const assetSchema = new Schema(
  {
    assetType: { type: String },
    name: { type: String },
    value: {
      type: Number,
      required: function () {
        return this.assetType != null;
      },
    },
    stake: { type: Number },
    mortgageDeed: { type: Number },
    valueYear: { type: Number },
    belongs: {
      type: String,
      required: function () {
        return this.assetType != null;
      },
    },
    tax: { type: Number },
    assessedValue: { type: Number }, // Taxeringsvärde
    legalTitleCost: { type: Number },
    investments: { type: Number },
  },
  { timestamps: true }
);

module.exports = assetSchema;
