const express = require("express");
const axios = require("axios");
const Vehicles = require("../models/Vehicle");

const router = express.Router();
const trackPodApiKey = "0c340847-b764-4ff8-9250-0bb089486648";
const trackPodApiUrl = "https://api.track-pod.com";

router.get("/fetch", async (req, res) => {
  try {
    const response = await axios.get(`${trackPodApiUrl}/Vehicle`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    const vehicles = response.data;

    if (!Array.isArray(vehicles)) {
      return res.status(500).json({ message: "Unexpected response format" });
    }

    // Optional: clean existing data first
    await Vehicles.deleteMany({});
    await Vehicles.insertMany(vehicles);

    res.status(200).json({ message: "Vehicles fetched and saved", count: vehicles.length });
  } catch (error) {
    console.error("Error fetching vehicles:", error.message);
    res.status(500).json({ error: "Failed to fetch or save vehicles" });
  }
});
router.post("/", async (req, res) => {
  try {
    const vehicleData = req.body;

    const response = await axios.post(`${trackPodApiUrl}/Vehicle`, vehicleData, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
        "Content-Type": "application/json",
      },
    });

    res.status(201).json({ message: "Vehicle added successfully", data: response.data });
  } catch (error) {
    console.error("Error adding vehicle:", error.message);
    res.status(500).json({ error: "Failed to add vehicle" });
  }
});
router.get("/:number", async (req, res) => {
  const { number } = req.params;

  try {
    const response = await axios.get(`${trackPodApiUrl}/Vehicle`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
      params: {
        number, // appends ?number=PJ
      },
    });

    res.status(200).json({
      message: "Vehicle data retrieved",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error.message);
    res.status(500).json({ error: "Failed to fetch vehicle by number" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.delete(`${trackPodApiUrl}/Vehicle/${id}`, {
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    res.status(200).json({ message: `Vehicle ${id} deleted successfully`, data: response.data });
  } catch (error) {
    console.error(`Error deleting vehicle ${id}:`, error.message);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});
router.get("/", async (req, res) => {
  const { number } = req.query;

  try {
    const response = await axios.get(`${trackPodApiUrl}/Vehicle`, {
      params: number ? { number } : {},
      headers: {
        accept: "text/plain",
        "X-API-KEY": trackPodApiKey,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching vehicle(s):", error.message);
    res.status(500).json({ error: "Failed to fetch vehicle(s)" });
  }
});
module.exports = router;
