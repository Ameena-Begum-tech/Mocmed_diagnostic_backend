// controllers/documentController.js

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


// ================= GET ALL PATIENT DOCUMENTS (DOCTOR) =================
exports.getPatientDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};


// ================= DELETE DOCUMENT (DOCTOR) =================
exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
