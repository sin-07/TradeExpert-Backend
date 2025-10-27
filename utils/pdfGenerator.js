const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const generateWelcomePDF = async (userName, userEmail) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>TradeXpert - Welcome Guide</title>
      <style>
        @page {
          margin: 0;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.4;
          color: #1a1a1a;
          background: #ffffff;
        }
        .page {
          width: 210mm;
          height: 297mm;
          padding: 0;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 40px;
          text-align: center;
          border-bottom: 3px solid rgba(255,255,255,0.3);
        }
        .header h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .header .tagline {
          font-size: 13px;
          opacity: 0.95;
          font-weight: 300;
          letter-spacing: 1px;
        }
        .content-wrapper {
          background: white;
          margin: 0 30px;
          padding: 20px 30px;
          min-height: calc(297mm - 160px);
        }
        .welcome-section {
          background: linear-gradient(to right, #f8f9ff, #ffffff);
          border-left: 4px solid #667eea;
          padding: 15px 20px;
          margin-bottom: 18px;
          border-radius: 0 6px 6px 0;
        }
        .welcome-section h2 {
          color: #667eea;
          font-size: 20px;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .welcome-section p {
          color: #555;
          font-size: 13px;
          line-height: 1.6;
        }
        .user-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 20px;
          border-radius: 10px;
          margin-bottom: 18px;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.25);
        }
        .user-card .label {
          font-size: 10px;
          opacity: 0.9;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .user-card .value {
          font-size: 14px;
          font-weight: 600;
          margin-top: 2px;
        }
        .user-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }
        .section-title {
          font-size: 18px;
          color: #1a1a1a;
          margin: 20px 0 12px 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #667eea;
          padding-bottom: 6px;
        }
        .section-title .icon {
          font-size: 22px;
          margin-right: 8px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }
        .feature-card {
          background: #f8f9ff;
          border: 1px solid #e0e5ff;
          border-left: 3px solid #667eea;
          padding: 12px 14px;
          border-radius: 6px;
        }
        .feature-card .feature-icon {
          font-size: 24px;
          margin-bottom: 6px;
          display: block;
        }
        .feature-card h3 {
          font-size: 13px;
          color: #667eea;
          margin-bottom: 4px;
          font-weight: 600;
        }
        .feature-card p {
          font-size: 11px;
          color: #666;
          line-height: 1.4;
        }
        .steps-container {
          background: #f8f9fa;
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 18px;
        }
        .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px dashed #dee2e6;
        }
        .step:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
          margin-right: 12px;
          box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
        }
        .step-content h3 {
          font-size: 13px;
          color: #1a1a1a;
          margin-bottom: 3px;
          font-weight: 600;
        }
        .step-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.4;
        }
        .support-banner {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border: 2px solid #667eea;
          border-radius: 10px;
          padding: 12px 20px;
          margin-top: 18px;
          text-align: center;
        }
        .support-banner h3 {
          color: #667eea;
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .support-banner p {
          color: #555;
          font-size: 11px;
          margin: 3px 0;
        }
        .support-banner .email {
          color: #667eea;
          font-weight: 600;
          font-size: 12px;
        }
        .footer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 15px 40px;
          margin-top: 0;
        }
        .footer p {
          font-size: 11px;
          opacity: 0.95;
          margin: 3px 0;
        }
        .footer .brand {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <h1>🎉 Welcome to TradeXpert</h1>
          <p class="tagline">YOUR PROFESSIONAL TRADING PLATFORM</p>
        </div>
        
        <div class="content-wrapper">
          <div class="welcome-section">
            <h2>Hello ${userName}! 👋</h2>
            <p>We're thrilled to welcome you to TradeXpert! Your account has been successfully created and is now ready for trading. This guide will help you get started with our platform and make the most of its powerful features.</p>
          </div>

          <div class="user-card">
            <div class="user-grid">
              <div>
                <div class="label">Account Holder</div>
                <div class="value">${userName}</div>
              </div>
              <div>
                <div class="label">Email Address</div>
                <div class="value">${userEmail}</div>
              </div>
              <div>
                <div class="label">Account Status</div>
                <div class="value">✓ Active</div>
              </div>
            </div>
          </div>

          <div class="section-title">
            <span class="icon">🚀</span>
            Platform Features
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <span class="feature-icon">📊</span>
              <h3>Real-Time Market Data</h3>
              <p>Access live prices and quotes from Indian stock markets with minimal latency</p>
            </div>
            <div class="feature-card">
              <span class="feature-icon">📈</span>
              <h3>Advanced Charting</h3>
              <p>Analyze trends with interactive charts including candlestick, line, and area views</p>
            </div>
            <div class="feature-card">
              <span class="feature-icon">💼</span>
              <h3>Portfolio Management</h3>
              <p>Track your investments, positions, and profit/loss in real-time</p>
            </div>
            <div class="feature-card">
              <span class="feature-icon">⚡</span>
              <h3>Quick Order Execution</h3>
              <p>Place market and limit orders instantly with our fast trading engine</p>
            </div>
          </div>

          <div class="section-title">
            <span class="icon">🎯</span>
            Getting Started Guide
          </div>
          <div class="steps-container">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Login to Your Dashboard</h3>
                <p>Use your registered email and password to access your trading dashboard</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Explore Your Watchlist</h3>
                <p>Add stocks you're interested in to track their real-time prices and movements</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Place Your First Order</h3>
                <p>Start trading with market or limit orders using our intuitive order panel</p>
              </div>
            </div>
          </div>

          <div class="support-banner">
            <h3>📞 Need Assistance?</h3>
            <p>Our support team is available 24/7 to help you</p>
            <p class="email">support@tradexpert.com</p>
            <p style="margin-top: 10px;">Visit our Help Center for detailed guides and tutorials</p>
          </div>
        </div>

        <div class="footer">
          <p class="brand">TradeXpert</p>
          <p>Trade Smarter, Not Harder</p>
          <p style="margin-top: 10px; opacity: 0.8;">© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const browser = await chromium.launch({
      headless: true
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    const pdfDir = path.join(__dirname, '..', 'pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    
    const fileName = `welcome_${userName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10px',
        right: '10px',
        bottom: '10px',
        left: '10px'
      }
    });
    
    await browser.close();
    
    return { filePath, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate welcome PDF');
  }
};

module.exports = { generateWelcomePDF };
