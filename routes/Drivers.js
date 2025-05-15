// routes/Drivers.js
const express = require("express");
const axios = require("axios");
const Drivers = require("../models/Drivers");

const router = express.Router();
const trackPodApiKey = "0c340847-b764-4ff8-9250-0bb089486648";
const trackPodApiUrl = "https://api.track-pod.com";

router.get("/fetch", async (req, res) => {
  try {
    const response = await axios.get(`${trackPodApiUrl}/Driver`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    const drivers = response.data;

    if (!Array.isArray(drivers)) {
      return res.status(500).json({ message: "Unexpected response format" });
    }

    // Optional: clean existing data first
    await Drivers.deleteMany({});
    await Drivers.insertMany(drivers);

    res.status(200).json({ message: "Drivers fetched and saved", count: drivers.length });
  } catch (error) {
    console.error("Error fetching drivers:", error.message);
    res.status(500).json({ error: "Failed to fetch or save drivers" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Drivers.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching from DB" });
  }
});
router.post("/add", async (req, res) => {
  const newDriver = req.body;

  try {
    const response = await axios.post(`${trackPodApiUrl}/Driver`, newDriver, {
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
        "X-API-KEY": trackPodApiKey,
      },
    });

    // Optionally save to DB if Track-POD API call is successful
    const savedDriver = await Drivers.create(newDriver);

    res.status(201).json({ message: "Driver added successfully", trackPodResponse: response.data, dbEntry: savedDriver });
  } catch (error) {
    console.error("Error adding driver:", error.message);
    res.status(500).json({ error: "Failed to add driver" });
  }
});

module.exports = router;
