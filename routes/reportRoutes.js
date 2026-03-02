const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const { uploadReport, getMyReports, downloadReport,deleteReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleWare");
const { viewReport } = require("../controllers/reportController");
const { getPatientUploads } = require("../controllers/reportController");

// ⭐ Doctor only route
router.get(
  "/patient-uploads",
  protect,
  authorize("SUPERADMIN"),
  getPatientUploads
);
router.delete(
  "/:id",
  protect,
  authorize("SUPERADMIN"),
  deleteReport
);

router.post("/upload", protect, authorize("SUPERADMIN"), upload.single("report"), uploadReport);

router.get("/my-reports", protect, getMyReports);

router.get("/download/:reportId", protect, downloadReport);
router.get("/view/:reportId", protect, viewReport);

module.exports = router;
