const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  pool: true,           
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const sendEmail = ({ to, subject, html }) => {
  transporter.sendMail({
    from: `"CampusIQ" <no-reply@campusiq.com>`,
    to,
    subject,
    html,
  })
  .then(() => {
    console.log("Reset email queued/sent successfully");
  })
  .catch((err) => {
    console.error("Email Send Error:", err.message);
  });
};

module.exports = sendEmail;
