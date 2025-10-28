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
          padding: 12px 30px;
          text-align: center;
          border-bottom: 2px solid rgba(255,255,255,0.3);
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 2px;
          letter-spacing: -0.5px;
        }
        .header .tagline {
          font-size: 10px;
          opacity: 0.95;
          font-weight: 300;
          letter-spacing: 0.8px;
        }
        .content-wrapper {
          background: white;
          margin: 0 25px;
          padding: 12px 25px;
          min-height: calc(297mm - 120px);
        }
        .welcome-section {
          background: linear-gradient(to right, #f8f9ff, #ffffff);
          border-left: 3px solid #667eea;
          padding: 10px 15px;
          margin-bottom: 10px;
          border-radius: 0 4px 4px 0;
        }
        .welcome-section h2 {
          color: #667eea;
          font-size: 15px;
          margin-bottom: 3px;
          font-weight: 600;
        }
        .welcome-section p {
          color: #555;
          font-size: 10px;
          line-height: 1.4;
        }
        .user-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        .user-card .label {
          font-size: 8px;
          opacity: 0.9;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .user-card .value {
          font-size: 11px;
          font-weight: 600;
          margin-top: 1px;
        }
        .user-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        .section-title {
          font-size: 14px;
          color: #1a1a1a;
          margin: 12px 0 8px 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          border-bottom: 1.5px solid #667eea;
          padding-bottom: 4px;
        }
        .section-title .icon {
          font-size: 16px;
          margin-right: 6px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }
        .feature-card {
          background: #f8f9ff;
          border: 1px solid #e0e5ff;
          border-left: 2px solid #667eea;
          padding: 8px 10px;
          border-radius: 4px;
        }
        .feature-card .feature-icon {
          font-size: 18px;
          margin-bottom: 4px;
          display: block;
        }
        .feature-card h3 {
          font-size: 10px;
          color: #667eea;
          margin-bottom: 2px;
          font-weight: 600;
        }
        .feature-card p {
          font-size: 8.5px;
          color: #666;
          line-height: 1.3;
        }
        .steps-container {
          background: #f8f9fa;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          padding-bottom: 8px;
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
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
          margin-right: 10px;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
        }
        .step-content h3 {
          font-size: 10px;
          color: #1a1a1a;
          margin-bottom: 2px;
          font-weight: 600;
        }
        .step-content p {
          font-size: 8.5px;
          color: #666;
          line-height: 1.3;
        }
        .support-banner {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border: 1.5px solid #667eea;
          border-radius: 8px;
          padding: 8px 15px;
          margin-top: 10px;
          text-align: center;
        }
        .support-banner h3 {
          color: #667eea;
          font-size: 11px;
          margin-bottom: 4px;
          font-weight: 600;
        }
        .support-banner p {
          color: #555;
          font-size: 8.5px;
          margin: 2px 0;
        }
        .support-banner .email {
          color: #667eea;
          font-weight: 600;
          font-size: 9.5px;
        }
        .footer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 10px 30px;
          margin-top: 0;
        }
        .footer p {
          font-size: 8.5px;
          opacity: 0.95;
          margin: 2px 0;
        }
        .footer .brand {
          font-weight: 700;
          font-size: 11px;
          margin-bottom: 2px;
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
            <p>We're thrilled to welcome you to TradeXpert! Your account is ready for trading.</p>
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
            <p>24/7 Support: <span class="email">support@tradexpert.com</span></p>
          </div>
        </div>

        <div class="footer">
          <p class="brand">TradeXpert</p>
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
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
        top: '5px',
        right: '5px',
        bottom: '5px',
        left: '5px'
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
