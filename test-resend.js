require('dotenv').config();
const { Resend } = require('resend');

async function testResend() {
  console.log('Testing Resend API...');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'SET (length: ' + process.env.RESEND_API_KEY.length + ')' : 'NOT SET');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('\nSending test email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'TradeXpert <onboarding@resend.dev>',
      to: 'aniket.singh07vs@gmail.com', // Send to yourself
      subject: 'Test Email from TradeXpert - Resend API',
      html: '<h1>Success!</h1><p>This email was sent via Resend API. Your OTP emails will work in production now! 🎉</p>',
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      process.exit(1);
    }

    console.log('✅ Test email sent successfully via Resend!');
    console.log('Email ID:', data.id);
    console.log('\n📧 Check your inbox at: aniket.singh07vs@gmail.com');
    console.log('   (Check spam folder if not in inbox)\n');
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testResend();
