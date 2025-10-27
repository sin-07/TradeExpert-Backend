const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  // For development, use a test account or configure with actual email service
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  });
};

module.exports = { createTransporter };
