// config/mailer.js
// Language: Node.js (JavaScript)

const nodemailer = require("nodemailer");
const dns = require("dns");

// ⭐ Force Node to prefer IPv4
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// ⭐ Debug SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error.message);
  } else {
    console.log("SMTP READY");
  }
});

module.exports = transporter;
