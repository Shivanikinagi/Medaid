# 🔐 OAuth Setup Guide - Google & GitHub Login

## ✅ Implementation Complete!

The MedAid application now supports **Google** and **GitHub** OAuth authentication! 

However, to make them work, you need to configure OAuth credentials from Google and GitHub.

---

## 📋 What's Been Implemented

### Backend
✅ Django Allauth installed and configured  
✅ OAuth views created for Google and GitHub  
✅ API endpoints: `/api/auth/google/` and `/api/auth/github/`  
✅ User creation/login from OAuth providers  
✅ JWT token generation after OAuth success  

### Frontend
✅ OAuth service created  
✅ Google and GitHub login buttons functional  
✅ OAuth callback pages for both providers  
✅ Automatic redirect after successful authentication  
✅ Error handling for OAuth failures  

---

## 🔧 Setup Instructions

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "MedAid" (or your choice)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "MedAid Web Client"
   
5. **Configure Authorized URLs**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/auth/google/callback
     http://localhost:3001/auth/google/callback
     ```

6. **Copy Credentials**
   - You'll get a **Client ID** and **Client Secret**
   - Keep these safe!

---

### Step 2: Create GitHub OAuth App

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Or: GitHub → Settings → Developer settings → OAuth Apps

2. **Create New OAuth App**
   - Click "New OAuth App"
   
3. **Fill in Application Details**
   - **Application name:** MedAid
   - **Homepage URL:** `http://localhost:3001`
   - **Authorization callback URL:** `http://localhost:3001/auth/github/callback`
   - **Enable Device Flow:** No (leave unchecked)

4. **Register Application**
   - Click "Register application"

5. **Generate Client Secret**
   - Click "Generate a new client secret"
   - Copy both **Client ID** and **Client Secret**
   - Keep these safe!

---

### Step 3: Configure Environment Variables

#### Backend (.env file)
Update `d:\medaid-full stack\backend\medaid\.env`:

```env
# OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID=your_actual_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_actual_google_client_secret

GITHUB_OAUTH_CLIENT_ID=your_actual_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_actual_github_client_secret
```

#### Frontend (.env file)
Update `d:\medaid-full stack\frontend\.env`:

```env
# OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_actual_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_actual_github_client_id
```

**Note:** Only Client IDs go in frontend, NOT secrets!

---

### Step 4: Restart Both Servers

After updating the .env files:

#### Restart Backend
```bash
# Stop current backend server (Ctrl+C)
cd "d:\medaid-full stack\backend\medaid"
python manage.py runserver
```

#### Restart Frontend
```bash
# Stop current frontend server (Ctrl+C)
cd "d:\medaid-full stack\frontend"
npm start
```

---

## 🎯 Testing OAuth Login

### Test Google Login
1. Go to http://localhost:3001/login
2. Click the "Google" button
3. You'll be redirected to Google login
4. Select your Google account
5. Grant permissions
6. You'll be redirected back and logged in!

### Test GitHub Login
1. Go to http://localhost:3001/login
2. Click the "Github" button
3. You'll be redirected to GitHub login
4. Enter credentials if needed
5. Authorize the app
6. You'll be redirected back and logged in!

---

## 🔍 OAuth Flow Diagram

```
User clicks "Login with Google/GitHub"
         ↓
Frontend redirects to OAuth provider
         ↓
User authorizes on Google/GitHub
         ↓
Provider redirects to callback URL with code
         ↓
Frontend sends code to backend
         ↓
Backend exchanges code for user info
         ↓
Backend creates/gets user account
         ↓
Backend generates JWT tokens
         ↓
Frontend stores tokens and redirects to dashboard
```

---

## 🐛 Troubleshooting

### Error: "Redirect URI mismatch"
- **Problem:** The callback URL doesn't match what's configured
- **Solution:** Make sure you added `http://localhost:3001/auth/google/callback` (or github) to authorized redirect URIs

### Error: "OAuth not configured"
- **Problem:** Client ID not set or still has placeholder value
- **Solution:** Replace `your_google_client_id_here` with actual credentials in .env files

### Error: "Invalid client"
- **Problem:** Client secret is wrong or not set
- **Solution:** Double-check you copied the correct secret from Google/GitHub

### Buttons show error message
- **Problem:** Environment variables not loaded
- **Solution:** 
  1. Check .env file has correct values
  2. Restart frontend server
  3. Clear browser cache
  4. Hard refresh (Ctrl+F5)

### Still redirects to regular login
- **Problem:** OAuth service not throwing error, might be configured with placeholders
- **Solution:** Check browser console (F12) for error messages

---

## 📱 Production Deployment

When deploying to production:

1. **Update Authorized URLs** in Google Cloud Console:
   ```
   https://yourdomain.com
   https://yourdomain.com/auth/google/callback
   ```

2. **Update GitHub OAuth App**:
   ```
   Homepage: https://yourdomain.com
   Callback: https://yourdomain.com/auth/github/callback
   ```

3. **Update Environment Variables**:
   - Use production OAuth credentials
   - Store secrets securely (e.g., AWS Secrets Manager, environment config)
   - Never commit .env files to version control

4. **Enable HTTPS**:
   - OAuth requires HTTPS in production
   - Get SSL certificate (Let's Encrypt, etc.)

---

## 🎉 Quick Start (If Already Configured)

If you've already set up OAuth credentials:

1. ✅ Credentials in .env files
2. ✅ Backend running on port 8000
3. ✅ Frontend running on port 3001
4. ✅ Click Google or GitHub button
5. ✅ Authorize and enjoy!

---

## 🔐 Security Notes

- **Never share** your Client Secrets
- **Never commit** .env files to git
- OAuth tokens are stored in `localStorage`
- Tokens automatically included in API requests
- Refresh tokens used for session management
- Logout clears all tokens

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Verify .env files have no typos
4. Ensure callback URLs match exactly
5. Try clearing browser cache/cookies

---

## ✨ Features

Once OAuth is configured, users can:

- 🚀 **Quick signup** - No password needed!
- 🔒 **Secure authentication** - OAuth 2.0 standard
- 📧 **Email auto-fill** - From OAuth provider
- 👤 **Profile auto-fill** - Name from provider
- 🔄 **Seamless experience** - One-click login
- 🛡️ **Enhanced security** - Two-factor if enabled on provider

---

**Enjoy your OAuth-enabled MedAid! 🏥💙**
