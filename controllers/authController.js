const User = require("../models/User");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// ⭐ Reusable Email Sender (BREVO API)
// BREVO API EMAIL SENDER (FIXED DEBUG VERSION)
const sendEmail = async (to, subject, html) => {
  try {
    console.log("SENDER:", process.env.EMAIL_USER);
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Mocmed Diagnostics",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("BREVO RESPONSE:", response.data);
  } catch (err) {
    console.log("BREVO FULL ERROR:", err.response?.data || err.message);
  }
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    // ⭐ SEND EMAIL (NON BLOCKING)
    sendEmail(
      email,
      "Mocmed Account Verification",
      `
        <h2>Verify Your Mocmed Account</h2>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes</p>
      `
    );

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: loginId }, { phone: loginId }, { username: loginId }],
    });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email first" });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PATIENTS =================
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "USER" }).select(
      "_id name email phone"
    );

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await User.updateOne(
      { _id: user._id },
      {
        resetOtp: String(otp),
        resetOtpExpires: Date.now() + 5 * 60 * 1000,
      }
    );

    sendEmail(
      email,
      "Reset your Mocmed password",
      `<h2>Password Reset OTP</h2><h1>${otp}</h1><p>Valid for 5 minutes</p>`
    );

    res.json({ message: "Reset OTP sent", userId: user._id });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findById(userId);

    user.password = password;
    await user.save();

    await User.updateOne(
      { _id: user._id },
      { $unset: { resetOtp: "", resetOtpExpires: "" } }
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= VERIFY RESET OTP =================
exports.verifyResetOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.resetOtp || !user.resetOtpExpires)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // check OTP
    if (user.resetOtp !== String(otp))
      return res.status(400).json({ message: "Invalid OTP" });

    // check expiry
    if (user.resetOtpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // ⭐ mark verified temporarily
    user.resetOtpVerified = true;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RESEND VERIFY OTP =================
exports.resendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ block if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // ✅ 30 sec cooldown
    if (
      user.lastOtpSentAt &&
      Date.now() - user.lastOtpSentAt.getTime() < 30000
    ) {
      return res.status(429).json({
        message: "Please wait 30 seconds before requesting again",
      });
    }

    // ✅ max resend limit
    if (user.resendOtpCount >= 5) {
      return res.status(429).json({
        message: "Maximum OTP resend limit reached",
      });
    }

    // 🔐 generate new otp
    const otp = otpGenerator.generate(6, {
       digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.resendOtpCount += 1;
    user.lastOtpSentAt = new Date();

    await user.save();

    // ⭐ send mail using existing function
    sendEmail(
      user.email,
      "Mocmed Account Verification (Resent)",
      `<h2>Your new OTP</h2><h1>${otp}</h1>`
    );

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log("RESEND OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
