require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Gmail SMTP Configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***configured***' : 'NOT SET');
console.log('Password length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
console.log('\n');

// Check if nodemailer is loaded correctly
console.log('Nodemailer loaded:', typeof nodemailer);
console.log('Nodemailer.createTransporter:', typeof nodemailer.createTransport);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const testEmail = async () => {
  try {
    console.log('Sending test email...');
    
    const info = await transporter.sendMail({
      from: `"TradeXpert Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from TradeXpert',
      html: `
        <h1>Test Email</h1>
        <p>If you receive this, your email configuration is working!</p>
        <p>OTP Example: <strong>123456</strong></p>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Email failed:');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Not using Gmail App Password (need 2-step verification enabled)');
    console.error('2. Regular password instead of App Password');
    console.error('3. Less secure apps disabled in Gmail');
    console.error('\nTo fix:');
    console.error('1. Go to https://myaccount.google.com/security');
    console.error('2. Enable 2-Step Verification');
    console.error('3. Go to App passwords: https://myaccount.google.com/apppasswords');
    console.error('4. Generate new app password for "Mail"');
    console.error('5. Update EMAIL_PASSWORD in .env with the 16-character password');
  }
};

testEmail();
