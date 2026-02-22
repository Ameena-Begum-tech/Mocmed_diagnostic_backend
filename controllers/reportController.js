const Report = require("../models/Report");
const User = require("../models/User");

// SUPERADMIN uploads report
exports.uploadReport = async (req, res) => {
  try {
    const { patientId, reportName, reportType } = req.body;

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const report = await Report.create({
      patient: patientId,
      reportName,
      reportType,
      fileUrl: req.file.path, // Cloudinary URL
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER gets his own reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user._id })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const path = require("path");
const fs = require("fs");

// SECURE DOWNLOAD REPORT
exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report)
      return res.status(404).json({ message: "Report not found" });

    if (
      report.patient.toString() !== req.user._id.toString() &&
      req.user.role !== "SUPERADMIN"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // redirect to cloudinary file
    return res.redirect(report.fileUrl);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.viewReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report)
      return res.status(404).json({ message: "Report not found" });

    if (
      report.patient.toString() !== req.user._id.toString() &&
      req.user.role !== "SUPERADMIN"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // open PDF in browser
    return res.redirect(report.fileUrl);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
