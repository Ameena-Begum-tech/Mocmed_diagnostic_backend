// config/mailer.js
// Language: Node.js (JavaScript)

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,          // IMPORTANT (not 465)
  secure: false,      // MUST be false for Railway
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    family: 4,        // ⭐ FORCE IPv4 (fixes ENETUNREACH on Railway)
  },
});

module.exports = transporter;
