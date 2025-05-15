// models/Driver.js
const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  Id: String,
  Number: Number,
  Name: String,
  Vehicle: String,
  Phone: String,
  Username: String,
  DepotId: String,
  Depot: String,
  HomeAddress: String,
  Zone: String,
  Active: Boolean,
});

module.exports = mongoose.model("Drivers", DriverSchema);
