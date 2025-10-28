const nodemailer = require('nodemailer');
const { Resend } = require('resend');

// Create transporter for sending emails
const createTransporter = () => {
  // If RESEND_API_KEY is available, use Resend (works on all hosting platforms)
  if (process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Using Resend API for email delivery');
    return null; // We'll handle Resend differently in emailService
  }
  
  // Otherwise use Gmail with nodemailer (for local development)
  console.log('[EMAIL] Using Gmail SMTP for email delivery');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
};

// Create Resend client if API key is available
const createResendClient = () => {
  if (process.env.RESEND_API_KEY) {
    return new Resend(process.env.RESEND_API_KEY);
  }
  return null;
};

module.exports = { createTransporter, createResendClient };

module.exports = { createTransporter };
