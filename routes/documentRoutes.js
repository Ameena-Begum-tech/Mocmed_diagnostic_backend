const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { protect } = require("../middleware/authMiddleWare");
const { uploadDocument } = require("../controllers/documentController");

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadDocument
);

module.exports = router;
