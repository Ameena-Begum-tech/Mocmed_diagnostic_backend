const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { getPatients } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleWare");
const { verifyOtp } = require("../controllers/authController");
const { viewReport } = require("../controllers/reportController");
const { forgotPassword } = require("../controllers/authController");
const { verifyResetOtp } = require("../controllers/authController");
const { resetPassword } = require("../controllers/authController");

router.post("/verify-otp", verifyOtp);
router.get("/view/:reportId", protect, viewReport);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/patients", protect, authorize("SUPERADMIN"), getPatients);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
