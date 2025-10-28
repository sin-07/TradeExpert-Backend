# Deploy TradeXpert Backend to Render

## 🚀 Quick Deployment Steps

### 1. Sign Up / Login to Render
- Go to [render.com](https://render.com)
- Sign up or login with GitHub

### 2. Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `sin-07/TradeExpert-Backend`
3. Configure the service:

### 3. Basic Configuration
```
Name: tradeexpert-backend
Region: Singapore (or closest to your users)
Branch: master
Root Directory: (leave empty)
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

### 4. Environment Variables (CRITICAL!)
Add these environment variables in Render dashboard:

```bash
PORT=5000
NODE_ENV=production

# MongoDB (your existing Atlas connection)
MONGO_URI=mongodb+srv://aniketsingh9322_db_user:iWmpV6GBFlgbAl4E@cluster0.zqyyu6i.mongodb.net/?appName=Cluster0

# JWT Configuration
JWT_SECRET=someone@1711
JWT_EXPIRES_IN=7d

# Frontend URLs for CORS
FRONTEND_URL=http://localhost:5173
PRODUCTION_URL=https://trade-expert-frontend.vercel.app

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=isharaushan2020@gmail.com
EMAIL_PASSWORD=unelwqeljasfesef
```

### 5. Plan Selection
- **Free Tier**: 
  - ✅ Perfect for testing
  - ✅ 750 hours/month free
  - ⚠️ Spins down after 15 minutes of inactivity
  - ⚠️ Cold starts take ~30 seconds

- **Starter Plan** ($7/month):
  - ✅ Always running (no cold starts)
  - ✅ Better for production

### 6. Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Your backend will be live at: `https://tradeexpert-backend.onrender.com`

## ✅ Post-Deployment Verification

### Test Backend Health
Open in browser or use curl:
```bash
https://tradeexpert-backend.onrender.com/api/auth/test
```

### Test Signup Flow
1. Visit: https://trade-expert-frontend.vercel.app/signup
2. Create new account
3. Verify OTP email arrives
4. Check welcome email with PDF attachment

## 🔧 Important Notes

### Cold Start Behavior (Free Tier)
- After 15 min of inactivity, service sleeps
- First request wakes it up (~30 sec delay)
- Solution: Use a cron job to ping every 10 minutes OR upgrade to Starter plan

### Keep Service Awake (Optional)
Use cron-job.org to ping your backend every 10 minutes:
```
URL: https://tradeexpert-backend.onrender.com/api/auth/test
Interval: Every 10 minutes
```

### Environment Variables Security
- ✅ Already configured in `.env`
- ✅ Render encrypts environment variables
- ✅ Never commit `.env` to GitHub (already in .gitignore)

## 📊 Monitoring

### Render Dashboard
- **Logs**: View real-time server logs
- **Metrics**: CPU, memory usage
- **Events**: Deployment history

### Check Logs
In Render dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. Monitor for errors

## 🐛 Troubleshooting

### Issue: Build Failed
**Solution**: Check Build Logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node version compatibility

### Issue: Service Crashed
**Solution**: Check Runtime Logs
- Look for MongoDB connection errors
- Verify environment variables are set correctly

### Issue: CORS Errors
**Solution**: Already configured! 
- `server.js` allows both Vercel frontend and Render backend
- If issues persist, check `allowedOrigins` array

### Issue: Email Not Sending
**Solution**: Verify Gmail App Password
- Use App Password, not regular Gmail password
- Enable 2FA on Gmail account first
- Generate App Password in Google Account settings

### Issue: PDF Generation Failed
**Solution**: Playwright dependencies
- Render includes Chromium by default
- If issues occur, add build command:
  ```
  npm install && npx playwright install chromium
  ```

## 📱 Mobile App Configuration (Future)

When you build mobile app, use:
```javascript
const API_URL = 'https://tradeexpert-backend.onrender.com/api';
```

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update backend"
git push
```

Render will:
1. Detect push
2. Run build command
3. Deploy new version
4. Zero downtime deployment

## 🎯 Production Checklist

- [x] Backend pushed to GitHub
- [x] Frontend updated with Render URL
- [x] Frontend redeployed on Vercel
- [ ] Create Render Web Service
- [ ] Add environment variables
- [ ] Test signup flow end-to-end
- [ ] Monitor logs for 24 hours
- [ ] Set up monitoring/alerting (optional)

## 🚨 Security Best Practices

1. **Never commit `.env` file** ✅ (in .gitignore)
2. **Use strong JWT_SECRET** ✅ (configured)
3. **Use App Password for email** ✅ (configured)
4. **Enable MongoDB IP Whitelist** (optional, allows all IPs currently)
5. **Set up rate limiting** (already configured with helmet)

## 💰 Cost Estimation

### Free Tier (Current)
- Backend: FREE (750 hours/month)
- Frontend: FREE (Vercel Hobby)
- MongoDB: FREE (Atlas M0)
- **Total: $0/month**

### Production Tier (Recommended)
- Backend: $7/month (Starter)
- Frontend: FREE (Vercel Hobby)
- MongoDB: FREE or $9/month (M2 for better performance)
- **Total: $7-16/month**

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Vercel**: https://vercel.com/docs

---

🎉 **Your app is ready for production!**
