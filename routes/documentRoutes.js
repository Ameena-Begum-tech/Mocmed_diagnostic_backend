const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { protect, authorize  } = require("../middleware/authMiddleWare");
const { uploadDocument } = require("../controllers/documentController");
const { getPatientDocuments } = require("../controllers/documentController");

// Doctor dashboard → patient uploads
router.get(
  "/patient-uploads",
  protect,
  authorize("SUPERADMIN"),
  getPatientDocuments
);

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadDocument
);

module.exports = router;
