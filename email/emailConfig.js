// Simplified email configuration - console only
// No external email service required
const createResendClient = () => {
  console.log('[EMAIL] Using console-only mode (no external email service)');
  return null;
};

module.exports = { createResendClient };
