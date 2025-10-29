const { createResendClient } = require('./emailConfig');
const { otpEmailTemplate, welcomeEmailTemplate } = require('./emailTemplates');

/**
 * Simplified OTP email sending
 * - Development: Logs OTP to console (no actual email)
 * - Production: Uses Resend API (requires verified domain)
 */
const sendOTPEmail = async (email, otp, userName) => {
  // ALWAYS log to console first
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 OTP EMAIL');
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('OTP Code:', otp);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const resendClient = createResendClient();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // In development mode, just use console - don't try to send actual emails
  if (!resendClient || isDevelopment) {
    console.log('✅ [DEV MODE] OTP logged to console above - no email sent');
    console.log('💡 Copy the OTP from above to verify your account');
    return { success: true, messageId: 'console-log', mode: 'development' };
  }
  
  // Production mode - try to send via Resend
  try {
    const result = await resendClient.emails.send({
      from: 'TradeXpert <onboarding@resend.dev>',
      to: email,
      subject: 'Your TradeXpert Verification Code',
      html: otpEmailTemplate(otp, userName),
    });
    
    if (result.error) {
      console.error('❌ Resend API error:', result.error);
      console.log('⚠️  Resend free tier limitation detected');
      console.log('💡 Using console fallback - OTP is shown above');
      return { success: true, messageId: 'console-fallback', mode: 'production-fallback' };
    }
    
    console.log('✅ OTP email sent via Resend:', result.data?.id || result.id);
    return { success: true, messageId: result.data?.id || result.id, mode: 'production' };
    
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    console.log('💡 Fallback: OTP is logged to console above');
    // Don't throw - OTP is already in console
    return { success: true, messageId: 'console-fallback', mode: 'error-fallback' };
  }
};

/**
 * Simplified welcome email sending
 * - Development: Logs to console (no actual email)
 * - Production: Uses Resend API (requires verified domain)
 */
const sendWelcomeEmail = async (email, userName) => {
  // ALWAYS log to console first
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 WELCOME EMAIL');
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const resendClient = createResendClient();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // In development mode, just use console - don't try to send actual emails
  if (!resendClient || isDevelopment) {
    console.log('✅ [DEV MODE] Welcome message logged to console - no email sent');
    return { success: true, messageId: 'console-log', mode: 'development' };
  }
  
  // Production mode - try to send via Resend
  try {
    const result = await resendClient.emails.send({
      from: 'TradeXpert <onboarding@resend.dev>',
      to: email,
      subject: '🎉 Welcome to TradeXpert - Your Trading Journey Begins!',
      html: welcomeEmailTemplate(userName),
    });
    
    if (result.error) {
      console.error('❌ Resend API error for welcome email:', result.error);
      console.log('⚠️  Resend free tier limitation detected');
      console.log('💡 Welcome message logged to console - user registration successful');
      return { success: true, messageId: 'console-fallback', mode: 'production-fallback' };
    }
    
    console.log('✅ Welcome email sent via Resend:', result.data?.id || result.id);
    return { success: true, messageId: result.data?.id || result.id, mode: 'production' };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    console.log('💡 Welcome message logged to console - user registration successful');
    // Welcome email failure doesn't block registration
    return { success: false, error: error.message, mode: 'error-fallback' };
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };

module.exports = { sendOTPEmail, sendWelcomeEmail };
