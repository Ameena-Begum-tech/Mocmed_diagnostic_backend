const Report = require("../models/Report");
const User = require("../models/User");

// ================= UPLOAD REPORT =================
exports.uploadReport = async (req, res) => {
  try {
    const { patientId, reportName, reportType, age, gender } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Patient required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🔥 Update USER collection with age & gender
    await User.findByIdAndUpdate(
      patientId,
      {
        age: Number(age),
        gender: gender,
      },
      { new: true }
    );

    // Save Report
    const report = await Report.create({
      patient: patientId,
      name: patient.name,
      age: Number(age),
      gender: gender,
      reportName,
      reportType,
      fileUrl: req.file.path,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Report uploaded successfully",
      report,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);
  res.json({ message: "Report deleted" });
};

// ================= GET MY REPORTS =================
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user._id })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PATIENT UPLOADS (Doctor Only) =================
exports.getPatientUploads = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.log("PATIENT UPLOAD FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DOWNLOAD REPORT =================
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

    return res.redirect(report.fileUrl);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VIEW REPORT =================
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

    return res.redirect(report.fileUrl);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
