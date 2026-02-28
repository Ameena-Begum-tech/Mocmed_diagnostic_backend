const Document = require("../models/Document");

// ================= UPLOAD DOCUMENT =================
exports.uploadDocument = async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      reportType,
      doorNumber,
      streetName,
      areaName,
      areaPincode,
      contactNumber,
      alternateContactNumber,
      email,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Report file is required" });
    }

    const document = await Document.create({
      user: req.user._id,
      patientName,
      age: Number(age),
      gender,
      reportType,
      fileUrl: req.file.path,

      address: {
        doorNumber,
        streetName,
        areaName,
        pincode: areaPincode,
      },

      contactNumber,
      alternateContactNumber,
      email,
    });

    res.status(201).json({
      message: "Document submitted successfully",
      document,
    });

  } catch (error) {
    console.error("DOCUMENT UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
