const { createResendClient } = require('./emailConfig');
const { otpEmailTemplate, welcomeEmailTemplate } = require('./emailTemplates');

/**
 * Simplified OTP email sending
 * - Development: Logs OTP to console
 * - Production: Uses Resend API
 */
const sendOTPEmail = async (email, otp, userName) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 OTP EMAIL');
    console.log('To:', email);
    console.log('Name:', userName);
    console.log('OTP Code:', otp);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const resendClient = createResendClient();
    
    if (!resendClient) {
      // Development mode - just log to console
      console.log('✅ [DEV MODE] OTP logged to console above');
      return { success: true, messageId: 'console-log', mode: 'development' };
    }
    
    // Production mode - send via Resend
    const result = await resendClient.emails.send({
      from: 'TradeXpert <onboarding@resend.dev>',
      to: email,
      subject: 'Your TradeXpert Verification Code',
      html: otpEmailTemplate(otp, userName),
    });
    
    if (result.error) {
      console.error('❌ Resend API error:', result.error);
      throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
    }
    
    console.log('✅ OTP email sent via Resend:', result.data?.id || result.id);
    return { success: true, messageId: result.data?.id || result.id, mode: 'production' };
    
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    // In development, this is not critical - OTP is in console
    if (!createResendClient()) {
      console.log('💡 Development mode: Check console above for OTP code');
      return { success: true, messageId: 'console-fallback', mode: 'development-fallback' };
    }
    throw error;
  }
};

/**
 * Simplified welcome email sending
 * - Development: Logs to console
 * - Production: Uses Resend API (without PDF on free plan)
 */
const sendWelcomeEmail = async (email, userName) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 WELCOME EMAIL');
    console.log('To:', email);
    console.log('Name:', userName);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const resendClient = createResendClient();
    
    if (!resendClient) {
      // Development mode - just log to console
      console.log('✅ [DEV MODE] Welcome email logged to console above');
      return { success: true, messageId: 'console-log', mode: 'development' };
    }
    
    // Production mode - send via Resend (no PDF attachment on free plan)
    const result = await resendClient.emails.send({
      from: 'TradeXpert <onboarding@resend.dev>',
      to: email,
      subject: '🎉 Welcome to TradeXpert - Your Trading Journey Begins!',
      html: welcomeEmailTemplate(userName),
    });
    
    if (result.error) {
      console.error('❌ Resend API error for welcome email:', result.error);
      throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
    }
    
    console.log('✅ Welcome email sent via Resend:', result.data?.id || result.id);
    return { success: true, messageId: result.data?.id || result.id, mode: 'production' };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    // Welcome email is not critical - user is already verified
    if (!createResendClient()) {
      console.log('💡 Development mode: Welcome email logged to console');
      return { success: true, messageId: 'console-fallback', mode: 'development-fallback' };
    }
    // Don't throw - welcome email failure shouldn't block user registration
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };

module.exports = { sendOTPEmail, sendWelcomeEmail };
