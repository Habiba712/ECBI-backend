// utils/sendEmail.js

const nodemailer = require("nodemailer");

async function sendEmail(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "SendGrid", etc.
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
     tls: {
    rejectUnauthorized: false, // 👈 allow self-signed certificate
  },
  });

  const info = await transporter.sendMail({
    from: `"ECBI Support" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });

  console.log("Email sent:", info.messageId);
}

module.exports = { sendEmail };