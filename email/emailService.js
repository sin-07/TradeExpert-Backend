const { createResendClient } = require('./emailConfig');
const { otpEmailTemplate, welcomeEmailTemplate } = require('./emailTemplates');

/**
 * Console-only OTP email
 * Works in both development and production
 * OTP is always logged to console/Render logs
 */
const sendOTPEmail = async (email, otp, userName) => {
  console.log('\n' + '='.repeat(60));
  console.log('📧 OTP VERIFICATION EMAIL');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('');
  console.log('🔑 YOUR OTP CODE:', otp);
  console.log('');
  console.log('⏰ Valid for: 10 minutes');
  console.log('='.repeat(60) + '\n');
  
  console.log('✅ OTP logged successfully');
  console.log('💡 In production, check Render logs to see the OTP');
  
  return { 
    success: true, 
    messageId: 'console-log-' + Date.now(), 
    mode: 'console',
    otp: otp // Return OTP for testing purposes
  };
};

/**
 * Console-only welcome message
 * Works in both development and production
 */
const sendWelcomeEmail = async (email, userName) => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 WELCOME TO TRADEXPERT');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('');
  console.log('Welcome aboard! Your account is now verified.');
  console.log('You can start trading with real-time market data.');
  console.log('='.repeat(60) + '\n');
  
  console.log('✅ Welcome message logged successfully');
  
  return { 
    success: true, 
    messageId: 'console-log-' + Date.now(), 
    mode: 'console' 
  };
};

module.exports = { sendOTPEmail, sendWelcomeEmail };

module.exports = { sendOTPEmail, sendWelcomeEmail };
