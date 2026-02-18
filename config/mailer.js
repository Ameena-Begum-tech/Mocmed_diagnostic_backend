const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Mocmed Diagnostics <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Mocmed account",
      html: `
        <h2>Mocmed Account Verification</h2>
        <p>Your OTP:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    console.log("OTP Email Sent");
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendOTP;
