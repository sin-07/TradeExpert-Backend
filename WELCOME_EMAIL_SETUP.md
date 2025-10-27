# Welcome Email System with PDF Attachment

## Overview
After successful signup and OTP verification, users receive a welcome email with a personalized PDF guide attached.

## Features
✅ **Professional Welcome Email** - HTML-formatted email with company branding
✅ **Personalized PDF Guide** - Custom PDF generated with user details
✅ **Automatic Sending** - Triggers after OTP verification
✅ **PDF Storage** - Generated PDFs stored in `/pdf` folder

## Setup Instructions

### 1. Install Dependencies
Run the following command in the backend directory:
```bash
npm install puppeteer
```

**Note:** Puppeteer will download Chromium (~170-280MB) during installation.

### 2. Environment Variables
Ensure these are set in your `.env` file:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
JWT_SECRET=your-secret-key
```

### 3. Test the System
1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Complete the signup flow:
   - Signup with email
   - Verify OTP
   - Check email for welcome message with PDF attachment

## File Structure
```
tradexpert-backend/
├── pdf/                          # PDF storage folder
│   ├── README.md                 # Documentation
│   └── *.pdf                     # Generated PDFs (ignored by git)
├── utils/
│   └── pdfGenerator.js           # PDF generation logic
├── email/
│   ├── emailService.js           # Email sending (updated)
│   └── emailTemplates.js         # HTML templates (added welcome)
└── controllers/
    └── authController.js         # Signup/verification (updated)
```

## How It Works

### 1. User Completes OTP Verification
When `verifyOTP` is called successfully:

### 2. PDF Generation
- `generateWelcomePDF()` creates a personalized PDF
- Uses Puppeteer to convert HTML to PDF
- Saves to `/pdf` folder with unique filename

### 3. Welcome Email Sent
- `sendWelcomeEmail()` sends HTML email
- Attaches the generated PDF
- Uses nodemailer with Gmail SMTP

### 4. PDF Cleanup (Optional)
Uncomment cleanup code in `authController.js` to auto-delete PDFs after sending.

## Troubleshooting

### Issue: Puppeteer Installation Fails
**Solution:** 
```bash
# Install with specific flags
npm install puppeteer --unsafe-perm=true --allow-root
```

### Issue: Chromium Not Found
**Solution:**
```bash
# Manually install Chromium
npx puppeteer browsers install chrome
```

### Issue: Email Not Sending
**Solution:**
1. Check Gmail credentials in `.env`
2. Ensure "App Password" is used (not regular password)
3. Check console logs for specific error

### Issue: PDF Generation Error
**Solution:**
1. Check if `/pdf` folder exists
2. Ensure write permissions on folder
3. Check Puppeteer installation

## Testing Tips

### Test PDF Generation Locally
```javascript
const { generateWelcomePDF } = require('./utils/pdfGenerator');

generateWelcomePDF('Test User', 'test@example.com')
  .then(result => console.log('PDF created:', result.filePath))
  .catch(error => console.error('Error:', error));
```

### Test Email Sending
```javascript
const { sendWelcomeEmail } = require('./email/emailService');

sendWelcomeEmail('recipient@example.com', 'Test User', './path/to/test.pdf')
  .then(result => console.log('Email sent:', result))
  .catch(error => console.error('Error:', error));
```

## PDF Customization

### Modify PDF Content
Edit `utils/pdfGenerator.js` to customize:
- Layout and styling
- User information displayed
- Features highlighted
- Color scheme
- Company branding

### Modify Email Content
Edit `email/emailTemplates.js` - `welcomeEmailTemplate()` to customize:
- Email text
- HTML structure
- Styling
- Call-to-action buttons

## Performance Notes

- **PDF Generation Time:** ~2-3 seconds per PDF
- **Email Sending Time:** ~1-2 seconds
- **Total Additional Time:** ~3-5 seconds added to verification process
- **Storage:** ~200KB per PDF file

## Security Considerations

✅ PDFs stored on server (not exposed publicly)
✅ Unique filenames prevent conflicts
✅ Only sent to verified email addresses
✅ No sensitive data in PDFs (demo account info only)

## Future Enhancements

- [ ] Add PDF templates for different user types
- [ ] Generate PDFs in background queue
- [ ] Add PDF expiration/cleanup scheduler
- [ ] Store PDFs in cloud storage (S3, etc.)
- [ ] Add analytics tracking for email opens

## Support

For issues or questions:
- Check console logs for detailed error messages
- Verify all dependencies are installed
- Ensure environment variables are set correctly
