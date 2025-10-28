const { createTransporter, createResendClient } = require('./emailConfig');
const { otpEmailTemplate, welcomeEmailTemplate } = require('./emailTemplates');

const sendOTPEmail = async (email, otp, userName) => {
  try {
    console.log('[EMAIL] Starting OTP email send to:', email)
    
    // Check if we should use Resend or Nodemailer
    const resendClient = createResendClient();
    
    if (resendClient) {
      // Use Resend API (works on all hosting platforms)
      console.log('[EMAIL] Using Resend API')
      const { data, error } = await resendClient.emails.send({
        from: 'TradeXpert <onboarding@resend.dev>', // Resend's test domain
        to: email,
        subject: 'Your TradeXpert Verification Code',
        html: otpEmailTemplate(otp, userName),
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('[EMAIL] OTP email sent successfully via Resend:', data.id);
      return { success: true, messageId: data.id };
    } else {
      // Use Gmail SMTP (for local development)
      console.log('[EMAIL] Using Gmail SMTP')
      console.log('[EMAIL] Email config:', {
        user: process.env.EMAIL_USER ? 'configured' : 'NOT SET',
        pass: process.env.EMAIL_PASSWORD ? 'configured' : 'NOT SET',
      })
      
      const transporter = createTransporter();
      const mailOptions = {
        from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your TradeXpert Verification Code',
        html: otpEmailTemplate(otp, userName),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('[EMAIL] OTP email sent successfully via Gmail:', info.messageId);
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error('[EMAIL] Error sending OTP email:', error.message)
    console.error('[EMAIL] Full error:', error)
    throw new Error('Failed to send OTP email')
  }
};

const sendWelcomeEmail = async (email, userName, pdfPath) => {
  try {
    const resendClient = createResendClient();
    
    if (resendClient) {
      // Use Resend API - note: attachments require paid plan
      console.log('[EMAIL] Sending welcome email via Resend (without PDF attachment on free plan)')
      const { data, error } = await resendClient.emails.send({
        from: 'TradeXpert <onboarding@resend.dev>',
        to: email,
        subject: '🎉 Welcome to TradeXpert - Your Trading Journey Begins!',
        html: welcomeEmailTemplate(userName),
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('[EMAIL] Welcome email sent successfully via Resend:', data.id);
      return { success: true, messageId: data.id };
    } else {
      // Use Gmail SMTP with PDF attachment
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
      console.log('[EMAIL] Welcome email sent successfully via Gmail:', info.messageId);
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error('[EMAIL] Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };
