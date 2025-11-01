const { createTransporter } = require('./emailConfig');
const { otpEmailTemplate, welcomeEmailTemplate, orderConfirmationEmailTemplate, forgotPasswordEmailTemplate } = require('./emailTemplates');

/**
 * Send OTP email using Gmail SMTP
 * Falls back to console if email is not configured
 */
const sendOTPEmail = async (email, otp, userName) => {
  // Always log to console as backup
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

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('✅ [CONSOLE MODE] OTP logged above - email not configured');
    console.log('💡 To send real emails, configure EMAIL_USER and EMAIL_PASSWORD in .env');
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const mailOptions = {
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your TradeXpert Verification Code',
      html: otpEmailTemplate(otp, userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully via Gmail:', info.messageId);
    console.log('📬 Email delivered to:', email);
    return { success: true, messageId: info.messageId, mode: 'gmail' };
    
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    console.log('💡 Fallback: OTP is logged to console above');
    // Don't throw - OTP is in console as backup
    return { success: true, messageId: 'console-fallback', mode: 'error-fallback' };
  }
};

/**
 * Send welcome email using Gmail SMTP
 * Falls back to console if email is not configured
 */
const sendWelcomeEmail = async (email, userName) => {
  // Always log to console as backup
  console.log('\n' + '='.repeat(60));
  console.log('🎉 WELCOME TO TRADEXPERT');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('');
  console.log('Welcome aboard! Your account is now verified.');
  console.log('You can start trading with real-time market data.');
  console.log('='.repeat(60) + '\n');

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('✅ [CONSOLE MODE] Welcome message logged - email not configured');
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const mailOptions = {
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to TradeXpert - Your Trading Journey Begins!',
      html: welcomeEmailTemplate(userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully via Gmail:', info.messageId);
    console.log('📬 Email delivered to:', email);
    return { success: true, messageId: info.messageId, mode: 'gmail' };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    console.log('💡 Welcome message logged to console - user registration successful');
    // Welcome email failure doesn't block registration
    return { success: false, error: error.message, mode: 'error-fallback' };
  }
};

/**
 * Send order confirmation email using Gmail SMTP
 * Falls back to console if email is not configured
 */
const sendOrderConfirmationEmail = async (email, userName, orderDetails) => {
  // Always log to console as backup
  console.log('\n' + '='.repeat(60));
  console.log(`📊 ORDER ${orderDetails.side.toUpperCase()} CONFIRMATION`);
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('User:', userName);
  console.log('Order ID:', orderDetails.orderId);
  console.log('Symbol:', orderDetails.symbol);
  console.log('Action:', orderDetails.side);
  console.log('Quantity:', orderDetails.quantity);
  console.log('Price:', `₹${orderDetails.price.toFixed(2)}`);
  console.log('Total Amount:', `₹${orderDetails.totalAmount.toFixed(2)}`);
  console.log('='.repeat(60) + '\n');

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('✅ [CONSOLE MODE] Order confirmation logged - email not configured');
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const mailOptions = {
      from: `"TradeXpert Trading" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${orderDetails.side === 'Buy' ? '✅' : '💰'} Order ${orderDetails.side} Confirmation - ${orderDetails.symbol}`,
      html: orderConfirmationEmailTemplate(userName, orderDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully via Gmail:', info.messageId);
    console.log('📬 Email delivered to:', email);
    return { success: true, messageId: info.messageId, mode: 'gmail' };
    
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
    console.log('💡 Order details logged to console - order was executed successfully');
    return { success: false, error: error.message, mode: 'error-fallback' };
  }
};

/**
 * Send Password Reset email
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 PASSWORD RESET EMAIL');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('');
  console.log('🔑 RESET CODE:', resetToken);
  console.log('');
  console.log('⏰ Valid for: 10 minutes');
  console.log('='.repeat(60) + '\n');

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('✅ [CONSOLE MODE] Reset code logged above - email not configured');
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const mailOptions = {
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your TradeXpert Password',
      html: forgotPasswordEmailTemplate(userName, resetToken),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully via Gmail:', info.messageId);
    console.log('📬 Email delivered to:', email);
    return { success: true, messageId: info.messageId, mode: 'gmail' };
    
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    console.log('💡 Fallback: Reset code is logged to console above');
    return { success: true, messageId: 'console-fallback', mode: 'error-fallback' };
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail, sendOrderConfirmationEmail, sendPasswordResetEmail };
