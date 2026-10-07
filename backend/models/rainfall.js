const mongoose = require("mongoose");

const rainfallSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      trim: true
    },
    averageRainfall: {
      type: Number,
      required: true,
      min: 0
    },
    rainfallFrequency: {
      type: String,
      trim: true
    },
    month: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Rainfall", rainfallSchema);