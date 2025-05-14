const mongoose = require("mongoose");

const marginDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discountRate: { type: Number, required: true },
  supplyPrice: { type: Number, required: true },
  premium: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  country: { type: String, required: true },  // Stores country name
  flag: { type: String, required: true },     // Stores flag URL
  salesProfit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MarginData", marginDataSchema);
