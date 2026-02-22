// Language: Node.js (JavaScript)

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.log("SMTP ERROR:", err.message);
  else console.log("SMTP READY (BREVO)");
});

module.exports = transporter;
