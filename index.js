require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectToDB = require("./db/conn");

const leadsCRUD = require("./routes/leadsCRUD");
const MarginData = require("./routes/MarginData");
const Orders = require("./routes/Orders");
const Drivers = require("./routes/Drivers");
const Vehicle = require("./routes/Vehicle");
const usersRouter = require("./routes/users.js");

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://track-pod.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();

app.use("/orders", Orders);
app.use("/users", usersRouter);

// cron.schedule("0 * * * *", async () => {
//   console.log("Fetching orders automatically...");
//   try {
//     await axios.get("http://localhost:5000/orders/fetch");
//   } catch (err) {
//     console.error("Auto-fetch failed:", err.message);
//   }
// });
  app.use("/leads", leadsCRUD);
  app.use("/MarginData", MarginData);
  app.use("/Vehicle", Vehicle);


app.use("/drivers", Drivers);


 app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Start Server
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
