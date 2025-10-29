require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = 'aniket.singh9322@gmail.com';
const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
const testName = 'Aniket Singh';

console.log('='.repeat(60));
console.log('Testing OTP Email to:', testEmail);
console.log('Generated OTP:', testOTP);
console.log('='.repeat(60));
console.log('\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Same template as in emailTemplates.js
const otpEmailTemplate = (otp, userName) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; text-align: center; }
    .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 30px 0; display: inline-block; }
    .info { color: #666; font-size: 14px; margin-top: 20px; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Verify Your Email</h1>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>Thank you for signing up with TradeXpert. Please use the following OTP to verify your email address:</p>
      <div class="otp-box">${otp}</div>
      <p class="info">⏰ This OTP will expire in 10 minutes</p>
      <p class="info">If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2025 TradeXpert. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

const sendTestEmail = async () => {
  try {
    console.log('Sending OTP email to:', testEmail);
    console.log('From:', process.env.EMAIL_USER);
    console.log('\n');

    const info = await transporter.sendMail({
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: 'Your TradeXpert Verification Code',
      html: otpEmailTemplate(testOTP, testName),
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n');
    console.log('='.repeat(60));
    console.log('CHECK YOUR INBOX:', testEmail);
    console.log('Subject: Your TradeXpert Verification Code');
    console.log('OTP Code:', testOTP);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Email failed:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
};

sendTestEmail();
