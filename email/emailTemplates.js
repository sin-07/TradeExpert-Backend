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

const orderConfirmationEmailTemplate = (userName, orderDetails) => {
  const { side, symbol, stockName, quantity, price, totalAmount, orderType, market, orderId, executedAt } = orderDetails;
  
  const isBuy = side === 'Buy';
  const actionColor = isBuy ? '#10b981' : '#ef4444';
  const actionText = isBuy ? 'BOUGHT' : 'SOLD';
  
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
          background: ${actionColor};
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #ffffff;
          margin: 10px 0 0 0;
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
        }
        .order-box {
          background: linear-gradient(135deg, ${actionColor}15 0%, ${actionColor}30 100%);
          border-left: 4px solid ${actionColor};
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .order-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .order-row:last-child {
          border-bottom: none;
        }
        .label {
          color: #666666;
          font-weight: 500;
        }
        .value {
          color: #333333;
          font-weight: 600;
        }
        .total-row {
          background-color: ${actionColor}20;
          padding: 15px;
          border-radius: 5px;
          margin-top: 15px;
        }
        .total-row .label {
          font-size: 18px;
          color: #333333;
        }
        .total-row .value {
          font-size: 24px;
          color: ${actionColor};
        }
        .info-text {
          color: #666666;
          line-height: 1.6;
          margin: 20px 0;
        }
        .success-badge {
          display: inline-block;
          background-color: ${actionColor};
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
        .disclaimer {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order ${actionText} Successfully!</h1>
          <p>TradeXpert - Your Trading Partner</p>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p class="info-text">
            Your ${side.toLowerCase()} order has been executed successfully. Here are the details:
          </p>
          
          <div class="success-badge">✓ ORDER FILLED</div>
          
          <div class="order-box">
            <div class="order-row">
              <span class="label">Order ID:</span>
              <span class="value">#${orderId}</span>
            </div>
            <div class="order-row">
              <span class="label">Stock Symbol:</span>
              <span class="value">${symbol}</span>
            </div>
            <div class="order-row">
              <span class="label">Stock Name:</span>
              <span class="value">${stockName}</span>
            </div>
            <div class="order-row">
              <span class="label">Market:</span>
              <span class="value">${market.toUpperCase()}</span>
            </div>
            <div class="order-row">
              <span class="label">Action:</span>
              <span class="value" style="color: ${actionColor};">${side.toUpperCase()}</span>
            </div>
            <div class="order-row">
              <span class="label">Order Type:</span>
              <span class="value">${orderType}</span>
            </div>
            <div class="order-row">
              <span class="label">Quantity:</span>
              <span class="value">${quantity} shares</span>
            </div>
            <div class="order-row">
              <span class="label">Price per Share:</span>
              <span class="value">₹${price.toFixed(2)}</span>
            </div>
            <div class="order-row">
              <span class="label">Executed At:</span>
              <span class="value">${new Date(executedAt).toLocaleString()}</span>
            </div>
            
            <div class="total-row">
              <div class="order-row">
                <span class="label">Total Amount:</span>
                <span class="value">₹${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <p class="info-text">
            ${isBuy 
              ? `The amount of ₹${totalAmount.toFixed(2)} has been deducted from your account balance.`
              : `The amount of ₹${totalAmount.toFixed(2)} has been credited to your account balance.`
            }
          </p>
          
          <div class="disclaimer">
            <strong>Disclaimer:</strong> This is a simulated trading platform for educational purposes. 
            No real money or stocks are involved in this transaction. Please trade responsibly and 
            conduct thorough research before making investment decisions in real markets.
          </div>
          
          <p class="info-text">
            You can view your complete portfolio and trading history in your dashboard.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
          <p style="margin-top: 10px;">
            Need help? Contact us at <a href="mailto:support@tradexpert.com">support@tradexpert.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const forgotPasswordEmailTemplate = (userName, resetToken) => {
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
        .reset-box {
          background: linear-gradient(135deg, #667eea15 0%, #764ba230 100%);
          border-left: 4px solid #667eea;
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .token-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 28px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          letter-spacing: 6px;
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
          font-size: 14px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
        .highlight {
          color: #667eea;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p class="info-text">
            We received a request to reset your password for your TradeXpert account. 
            Use the reset code below to set a new password.
          </p>
          
          <div class="reset-box">
            <h3 style="margin-top: 0; color: #667eea;">Your Password Reset Code:</h3>
            <div class="token-box">${resetToken}</div>
          </div>
          
          <p class="info-text">
            This code will expire in <span class="highlight">10 minutes</span> for security reasons.
          </p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, 
            please ignore this email. Your password will remain unchanged and your account is secure.
          </div>
          
          <p class="info-text">
            To reset your password:
          </p>
          <ol style="color: #666666; line-height: 1.8;">
            <li>Copy the reset code above</li>
            <li>Go to the password reset page</li>
            <li>Enter your email and the reset code</li>
            <li>Create a new strong password</li>
          </ol>
          
          <p class="info-text" style="margin-top: 30px;">
            If you have any questions or need assistance, please contact our support team.
          </p>
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

module.exports = {
  otpEmailTemplate,
  welcomeEmailTemplate,
  orderConfirmationEmailTemplate,
  forgotPasswordEmailTemplate
};

