const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const { uploadReport, getMyReports, downloadReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleWare");
const { viewReport } = require("../controllers/reportController");

router.post("/upload", protect, authorize("SUPERADMIN"), upload.single("report"), uploadReport);

router.get("/my-reports", protect, getMyReports);

router.get("/download/:reportId", protect, downloadReport);
router.get("/view/:reportId", protect, viewReport);

module.exports = router;
