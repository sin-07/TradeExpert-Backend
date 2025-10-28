# 🔐 Render Environment Variables - Copy & Paste Ready

## Instructions
1. Go to Render dashboard → Your service → "Environment" tab
2. Click "Add Environment Variable"
3. Copy each line below (without the # comments)
4. Paste KEY in left field, VALUE in right field

---

## Required Environment Variables

```bash
PORT
5000

NODE_ENV
production

MONGO_URI
mongodb+srv://aniketsingh9322_db_user:iWmpV6GBFlgbAl4E@cluster0.zqyyu6i.mongodb.net/?appName=Cluster0

JWT_SECRET
someone@1711

JWT_EXPIRES_IN
7d

FRONTEND_URL
http://localhost:5173

PRODUCTION_URL
https://trade-expert-frontend.vercel.app

EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
isharaushan2020@gmail.com

EMAIL_PASSWORD
unelwqeljasfesef
```

---

## Quick Copy Format (Alternative)

If Render supports bulk import:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://aniketsingh9322_db_user:iWmpV6GBFlgbAl4E@cluster0.zqyyu6i.mongodb.net/?appName=Cluster0
JWT_SECRET=someone@1711
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
PRODUCTION_URL=https://trade-expert-frontend.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=isharaushan2020@gmail.com
EMAIL_PASSWORD=unelwqeljasfesef
```

---

⚠️ **SECURITY WARNING**: 
- These credentials are from your existing `.env` file
- DO NOT share this file publicly
- Consider rotating JWT_SECRET and email password after deployment
- This file is already in `.gitignore` to prevent accidental commits

✅ **After adding all variables**, click "Save Changes" and Render will redeploy automatically.
