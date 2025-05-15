// routes/Orders.js
const express = require("express");
const axios = require("axios");
const Order = require("../models/Orders");
const trackPodApiKey = "0c340847-b764-4ff8-9250-0bb089486648"; // Replace with your real API key
const trackPodApiUrl = "https://api.track-pod.com";

const router = express.Router();
router.get("/fetch", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.track-pod.com/Order/Route/Date/2025-05-01T00%3A00%3A00",
      {
        headers: {
          accept: "text/plain",
          "X-API-KEY": "0c340847-b764-4ff8-9250-0bb089486648",
        },
      }
    );

    const orders = response.data;

    if (!Array.isArray(orders)) {
      return res.status(500).json({ message: "Unexpected response format" });
    }

    await Order.deleteMany({ RouteDate: new Date("2025-05-01T00:00:00") });
    await Order.insertMany(orders);

    res.status(200).json({ message: "Orders fetched and saved", count: orders.length });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Failed to fetch or save orders" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const orderData = req.body;

    const response = await axios.post(`${trackPodApiUrl}/Order`, orderData, {
      headers: {
        "Authorization": `Bearer ${trackPodApiKey}`,
        "Content-Type": "application/json"
      }
    });

    // Optional: save order locally
    // const savedOrder = await Order.create(response.data);

    res.status(201).json({
      message: "Order created in Track-POD successfully",
      trackPodResponse: response.data
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      error: "Failed to create order in Track-POD",
      details: error.response?.data || error.message
    });
  }
});
// router.get("/fetch", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.track-pod.com/Order/Route/Date/2025-05-01T00%3A00%3A00",
//       {
//         headers: {
//           accept: "text/plain",
//           "X-API-KEY": "0c340847-b764-4ff8-9250-0bb089486648",
//         },
//       }
//     );

//     const orders = response.data;

//     if (!Array.isArray(orders)) {
//       return res.status(500).json({ message: "Unexpected response format" });
//     }

//     // Optional: Remove existing orders for this date to avoid duplicates
//     await Order.deleteMany({ RouteDate: new Date("2025-05-01T00:00:00") });

//     // Save to MongoDB
//     await Order.insertMany(orders);

//     res.status(200).json({ message: "Orders fetched and saved", count: orders.length });
//   } catch (error) {
//     console.error("Error fetching orders:", error.message);
//     res.status(500).json({ error: "Failed to fetch or save orders" });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching from DB" });
  }
});

module.exports = router;
