const express = require("express");
const Rainfall = require("../models/rainfall");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const rainfall = await Rainfall.find().sort({
      averageRainfall: -1
    });

    res.json(rainfall);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rainfall data"
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const {
      region,
      averageRainfall,
      rainfallFrequency,
      month,
      year
    } = req.body;

    if (!region || averageRainfall === undefined) {
      return res.status(400).json({
        message: "Region and average rainfall are required"
      });
    }

    const rainfall = await Rainfall.create({
      region,
      averageRainfall,
      rainfallFrequency,
      month,
      year
    });

    res.status(201).json({
      message: "Rainfall data added successfully",
      rainfall
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add rainfall data"
    });
  }
});

module.exports = router;