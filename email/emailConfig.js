const nodemailer = require('nodemailer');

/**
 * Create email transporter using Gmail
 * Make sure to use App Password, not regular Gmail password
 * How to get App Password:
 * 1. Go to Google Account settings
 * 2. Security → 2-Step Verification (enable it)
 * 3. Security → App passwords → Generate new app password
 * 4. Use that password in EMAIL_PASSWORD env variable
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('[EMAIL] ⚠️  EMAIL_USER or EMAIL_PASSWORD not configured - emails will be logged to console only');
    return null;
  }

  console.log('[EMAIL] ✅ Using Gmail SMTP for email delivery');
  return nodemailer.createTransporter({
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

module.exports = { createTransporter };
