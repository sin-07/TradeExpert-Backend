const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  // Configure transporter with sensible timeouts to avoid long request hangs
  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure = String(port) === '465'; // secure true for 465, false otherwise

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // App password recommended
    },
    // Avoid long hangs on cold SMTP or blocked egress by setting timeouts
    connectionTimeout: 10000, // 10s to establish connection
    greetingTimeout: 10000,   // 10s to receive greeting after connection
    socketTimeout: 20000,     // 20s for data transfer operations
    // Use a small pool for efficiency; keeps connection warm across requests
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
    tls: {
      // Some providers on PaaS may require this to prevent cert issues
      rejectUnauthorized: false,
    },
  });
};

module.exports = { createTransporter };
