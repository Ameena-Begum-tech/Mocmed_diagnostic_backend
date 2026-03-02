// routes/documentRoutes.js

const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const { protect, authorize } = require("../middleware/authMiddleWare");

const {
  uploadDocument,
  getPatientDocuments,
  deleteDocument,
} = require("../controllers/documentController");

// ================= PATIENT UPLOAD =================
router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadDocument
);

// ================= DOCTOR DASHBOARD =================
router.get(
  "/patient-uploads",
  protect,
  authorize("SUPERADMIN"),
  getPatientDocuments
);

// ================= DELETE DOCUMENT =================
router.delete(
  "/:id",
  protect,
  authorize("SUPERADMIN"),
  deleteDocument
);

module.exports = router;
