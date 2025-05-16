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
router.put("/update", async (req, res) => {
  try {
    const orderData = req.body;

    const response = await axios.put(`${trackPodApiUrl}/Order?updateAddressGps=false`, orderData, {
      headers: {
        "X-API-KEY": trackPodApiKey,
        "Content-Type": "application/json",
        "accept": "text/plain",
      },
    });

    // Optional: update the local DB if needed
    // await Order.findOneAndUpdate({ Number: orderData.Number }, orderData, { new: true, upsert: true });

    res.status(200).json({
      message: "Order updated in Track-POD successfully",
      trackPodResponse: response.data,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({
      error: "Failed to update order in Track-POD",
      details: error.response?.data || error.message,
    });
  }
});
router.get("/get/:number", async (req, res) => {
  try {
    const orderNumber = req.params.number;

    const response = await axios.get(`${trackPodApiUrl}/Order/Number/${orderNumber}`, {
      headers: {
        "X-API-KEY": trackPodApiKey,
        "accept": "text/plain"
      },
    });

    res.status(200).json({
      message: "Order retrieved successfully from Track-POD",
      order: response.data
    });
  } catch (error) {
    console.error("Error retrieving order:", error.message);
    res.status(500).json({
      error: "Failed to retrieve order from Track-POD",
      details: error.response?.data || error.message
    });
  }
});
router.delete("/delete/:number", async (req, res) => {
  try {
    const orderNumber = req.params.number;

    const response = await axios.delete(`${trackPodApiUrl}/Order/Number/${orderNumber}`, {
      headers: {
        "X-API-KEY": trackPodApiKey,
        "accept": "text/plain"
      },
    });

    res.status(200).json({
      message: `Order with number ${orderNumber} deleted successfully from Track-POD`,
      trackPodResponse: response.data
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({
      error: "Failed to delete order from Track-POD",
      details: error.response?.data || error.message
    });
  }
});
router.get("/id/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const response = await axios.get(`${trackPodApiUrl}/Order/Id/${orderId}`, {
      headers: {
        "X-API-KEY": trackPodApiKey,
        "accept": "text/plain"
      },
    });

    res.status(200).json({
      message: `Order with ID ${orderId} fetched successfully from Track-POD`,
      trackPodResponse: response.data
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    res.status(500).json({
      error: "Failed to fetch order from Track-POD",
      details: error.response?.data || error.message
    });
  }
});
router.delete("/id/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const response = await axios.delete(`${trackPodApiUrl}/Order/Id/${orderId}`, {
      headers: {
        "X-API-KEY": trackPodApiKey,
        "accept": "text/plain"
      },
    });

    res.status(200).json({
      message: `Order with ID ${orderId} deleted successfully from Track-POD`,
      trackPodResponse: response.data
    });
  } catch (error) {
    console.error("Error deleting order by ID:", error.message);
    res.status(500).json({
      error: "Failed to delete order from Track-POD",
      details: error.response?.data || error.message
    });
  }
});
router.get("/trackId/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;

    const response = await axios.get(`${trackPodApiUrl}/Order/TrackId/${trackId}`, {
      headers: {
        "X-API-KEY": trackPodApiKey,
        "accept": "text/plain",
      },
    });

    res.status(200).json({
      message: `Order fetched successfully by TrackId: ${trackId}`,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching order by TrackId:", error.message);
    res.status(500).json({
      error: "Failed to fetch order from Track-POD",
      details: error.response?.data || error.message,
    });
  }
});
router.put("/trackId/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;
    const { updateAddressGps = false } = req.query;
    const orderData = req.body;

    const response = await axios.put(
      `${trackPodApiUrl}/Order/TrackId/${trackId}?updateAddressGps=${updateAddressGps}`,
      orderData,
      {
        headers: {
          "X-API-KEY": trackPodApiKey,
          "accept": "text/plain",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: `Order with TrackId ${trackId} updated successfully`,
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating order by TrackId:", error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to update order",
      details: error.response?.data || error.message,
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
