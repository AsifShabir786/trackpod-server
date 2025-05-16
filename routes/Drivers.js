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
// PUT: Update an existing driver in Track-POD and DB
router.put("/update", async (req, res) => {
  const updatedDriver = req.body;

  if (!updatedDriver.Id) {
    return res.status(400).json({ error: "Driver Id is required for update." });
  }

  try {
    const response = await axios.put(`${trackPodApiUrl}/Driver`, updatedDriver, {
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
        "X-API-KEY": trackPodApiKey,
      },
    });

    // Optionally update in DB
    const updatedDbDriver = await Driver.findOneAndUpdate(
      { Id: updatedDriver.Id },
      updatedDriver,
      { new: true, upsert: true } // upsert true will create if not exists
    );

    res.status(200).json({
      message: "Driver updated successfully",
      trackPodResponse: response.data,
      dbEntry: updatedDbDriver,
    });
  } catch (error) {
    console.error("Error updating driver:", error.message);
    res.status(500).json({ error: "Failed to update driver" });
  }
});
// DELETE: Remove a driver by ID from Track-POD and optionally from your DB
router.delete("/delete/:id", async (req, res) => {
  const driverId = req.params.id;

  if (!driverId) {
    return res.status(400).json({ error: "Driver ID is required" });
  }

  try {
    // Delete from Track-POD
    const response = await axios.delete(`${trackPodApiUrl}/Driver/Id/${driverId}`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    // Optional: remove from local DB if needed
    await Driver.findOneAndDelete({ Id: driverId });

    res.status(200).json({
      message: `Driver with ID ${driverId} deleted successfully`,
      trackPodResponse: response.data,
    });
  } catch (error) {
    console.error("Error deleting driver:", error.message);
    res.status(500).json({ error: "Failed to delete driver" });
  }
});
// GET: Fetch a specific driver by ID from Track-POD
router.get("/:id", async (req, res) => {
  const driverId = req.params.id;

  if (!driverId) {
    return res.status(400).json({ error: "Driver ID is required" });
  }

  try {
    const response = await axios.get(`${trackPodApiUrl}/Driver/Id/${driverId}`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching driver by ID:", error.message);
    res.status(500).json({ error: "Failed to fetch driver" });
  }
});
// GET: Fetch a driver by Username from Track-POD
router.get("/username/:username", async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await axios.get(`${trackPodApiUrl}/Driver/Username/${username}`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching driver by username:", error.message);
    res.status(500).json({ error: "Failed to fetch driver" });
  }
});
// DELETE: Remove a driver by Username from Track-POD
router.delete("/username/:username", async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await axios.delete(`${trackPodApiUrl}/Driver/Username/${username}`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    res.status(200).json({ message: "Driver deleted successfully", data: response.data });
  } catch (error) {
    console.error("Error deleting driver by username:", error.message);
    res.status(500).json({ error: "Failed to delete driver" });
  }
});

module.exports = router;
