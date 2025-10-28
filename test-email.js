require('dotenv').config();
const nodemailer = require('nodemailer');
console.log('Nodemailer loaded:', typeof nodemailer, Object.keys(nodemailer));

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  try {
    console.log('\nVerifying transporter...');
    await transporter.verify();
    console.log('✅ Email configuration is valid!');
    
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: `"TradeXpert Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from TradeXpert',
      text: 'This is a test email. If you receive this, your email configuration is working!',
      html: '<b>This is a test email.</b> If you receive this, your email configuration is working!',
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox at:', process.env.EMAIL_USER);
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  AUTHENTICATION FAILED!');
      console.error('This usually means:');
      console.error('1. Wrong email or password');
      console.error('2. Not using Gmail App Password (required for Gmail)');
      console.error('3. 2-Factor Authentication not enabled on Gmail');
      console.error('\nCreate App Password at: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      console.error('\n⚠️  CONNECTION TIMEOUT!');
      console.error('SMTP server is not reachable. Check your network or SMTP settings.');
    }
  }
  
  process.exit(0);
}

testEmail();
