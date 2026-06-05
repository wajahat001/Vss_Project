const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

async function sendMail(to, subject, html) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"PulseCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
