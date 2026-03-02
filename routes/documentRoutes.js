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

router.delete(
  "/:id",
  protect,
  authorize("SUPERADMIN"),
  async (req, res) => {
    const Document = require("../models/Document");

    try {
      await Document.findByIdAndDelete(req.params.id);
      res.json({ message: "Document deleted" });
    } catch {
      res.status(500).json({ message: "Delete failed" });
    }
  }
);

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadDocument
);

module.exports = router;
