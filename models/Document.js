const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    reportType: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    address: {
      doorNumber: String,
      streetName: String,
      areaName: String,
      pincode: String,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    alternateContactNumber: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
