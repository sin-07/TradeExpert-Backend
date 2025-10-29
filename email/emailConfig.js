const { Resend } = require('resend');

// Simplified email configuration
// In development: logs to console
// In production: uses Resend API
const createResendClient = () => {
  if (process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Using Resend API for email delivery');
    return new Resend(process.env.RESEND_API_KEY);
  }
  console.log('[EMAIL] No RESEND_API_KEY found - emails will be logged to console only');
  return null;
};

module.exports = { createResendClient };
