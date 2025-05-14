const mongoose = require("mongoose");

const primeassetFormSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  message: { type: String },
  creditConsent: { type: Boolean, default: false }, // Add missing fields
  marketingConsent: { type: Boolean, default: false },
  dataSharingConsent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["New", "Engaged", "Proposal Sent", "Closed-Won", "Closed-Lost"],
    default: "New",
  },
});

module.exports = mongoose.model("LeadsCRUD", primeassetFormSchema);
