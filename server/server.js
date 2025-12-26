require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const CALENDARIFIC_API_KEY = process.env.CALENDARIFIC_API_KEY;

// Health check
app.get("/", (req, res) => {
  res.send("Smart Yatra Backend is running 🎉");
});

// ⭐ LIVE API festivals route
app.get("/api/festivals", async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const country = req.query.country || "IN";

    const url = `https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=${country}&year=${year}`;
    const response = await axios.get(url);

    res.json(response.data.response.holidays); // return array
  } catch (error) {
    console.error("Festival API Error:", error.message);
    res.json([]); // fallback return empty array if API fails
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
