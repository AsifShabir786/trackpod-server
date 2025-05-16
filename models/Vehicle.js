const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  Id: Number,
  DriverId: String,
  DriverUsername: String,
  DepotId: String,
  Depot: String,
  Number: String,
  Weight: Number,
  Volume: Number,
  Pallets: Number,
});

module.exports = mongoose.model("Vehicles", VehicleSchema);
