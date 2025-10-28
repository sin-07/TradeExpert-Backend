const { createTransporter } = require('./emailConfig');
const { otpEmailTemplate, welcomeEmailTemplate } = require('./emailTemplates');

const sendOTPEmail = async (email, otp, userName) => {
  try {
    console.log('[EMAIL] Starting OTP email send to:', email)
    console.log('[EMAIL] Email config:', {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      user: process.env.EMAIL_USER ? 'configured' : 'NOT SET',
      pass: process.env.EMAIL_PASSWORD ? 'configured' : 'NOT SET',
    })
    
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your TradeXpert Verification Code',
      html: otpEmailTemplate(otp, userName),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[EMAIL] OTP email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[EMAIL] Error sending OTP email:', error.message)
    console.error('[EMAIL] Full error:', error)
    throw new Error('Failed to send OTP email')
  }
};

const sendWelcomeEmail = async (email, userName, pdfPath) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to TradeXpert - Your Trading Journey Begins!',
      html: welcomeEmailTemplate(userName),
      attachments: [
        {
          filename: 'TradeXpert_Welcome_Guide.pdf',
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };
