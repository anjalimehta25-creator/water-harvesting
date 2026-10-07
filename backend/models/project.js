const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    catchmentArea: {
      type: Number,
      required: true,
      min: 1
    },
    annualRainfall: {
      type: Number,
      required: true,
      min: 1
    },
    runoffCoefficient: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1
    },
    storageCapacity: {
      type: Number,
      default: 0,
      min: 0
    },
    installationDate: {
      type: Date
    },
    description: {
      type: String,
      maxlength: 1000
    },
    harvestedWater: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedAnnualCollection: {
      type: Number,
      default: 0,
      min: 0
    },
    designFile: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending"
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);