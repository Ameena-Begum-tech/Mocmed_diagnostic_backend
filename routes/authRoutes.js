const express = require("express");
const router = express.Router();

// ⭐ Import EVERYTHING in ONE destructuring
const {
  registerUser,
  loginUser,
  verifyOtp,
  getPatients,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleWare");
const { viewReport } = require("../controllers/reportController");
const { resendVerifyOtp } = require("../controllers/authController");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendVerifyOtp);

router.get("/patients", protect, authorize("SUPERADMIN"), getPatients);
router.get("/view/:reportId", protect, viewReport);

module.exports = router;
