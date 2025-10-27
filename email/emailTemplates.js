const otpEmailTemplate = (otp, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          letter-spacing: 8px;
          margin: 30px 0;
        }
        .info-text {
          color: #666666;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TradeXpert</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p class="info-text">
            You requested to verify your email address. Please use the following OTP (One-Time Password) to complete your verification:
          </p>
          <div class="otp-box">
            ${otp}
          </div>
          <p class="info-text">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
          </p>
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request this verification, please ignore this email and ensure your account is secure.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const welcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
          padding: 40px;
          text-align: center;
        }
        .content h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin: 10px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h1>Welcome to TradeXpert! 🎉</h1>
          <p><strong>Hello ${userName}!</strong></p>
          <p>Welcome aboard! Your account is ready. Please check the attached PDF for complete details.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { otpEmailTemplate, welcomeEmailTemplate };
