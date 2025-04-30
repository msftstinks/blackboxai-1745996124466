const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for LMS Login',
    text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
