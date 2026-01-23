# 🚀 Quick OAuth Credentials Setup

## Step-by-Step: Get Your OAuth Credentials in 5 Minutes

### 🔵 Google OAuth (2 minutes)

1. **Open:** https://console.cloud.google.com/apis/credentials
2. **Click:** "+ CREATE CREDENTIALS" → "OAuth client ID"
3. **Select:** "Web application"
4. **Add Redirect URIs:**
   ```
   http://localhost:3001/auth/google/callback
   ```
5. **Copy:** Client ID and Client Secret
6. **Done!**

### ⚫ GitHub OAuth (2 minutes)

1. **Open:** https://github.com/settings/developers
2. **Click:** "New OAuth App"
3. **Fill in:**
   - Application name: `MedAid`
   - Homepage URL: `http://localhost:3001`
   - Callback URL: `http://localhost:3001/auth/github/callback`
4. **Click:** "Register application"
5. **Click:** "Generate a new client secret"
6. **Copy:** Client ID and Client Secret
7. **Done!**

---

## 📝 Update .env Files

### Backend: `d:\medaid-full stack\backend\medaid\.env`

```env
GOOGLE_OAUTH_CLIENT_ID=paste_your_google_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=paste_your_google_secret_here
GITHUB_OAUTH_CLIENT_ID=paste_your_github_client_id_here
GITHUB_OAUTH_CLIENT_SECRET=paste_your_github_secret_here
```

### Frontend: `d:\medaid-full stack\frontend\.env`

```env
REACT_APP_GOOGLE_CLIENT_ID=paste_your_google_client_id_here
REACT_APP_GITHUB_CLIENT_ID=paste_your_github_client_id_here
```

---

## ⚡ Restart Servers

```bash
# Backend - In one terminal
cd "d:\medaid-full stack\backend\medaid"
python manage.py runserver

# Frontend - In another terminal
cd "d:\medaid-full stack\frontend"
npm start
```

---

## ✅ Test It!

1. Go to http://localhost:3001/login
2. Click "Google" or "Github" button
3. Authorize
4. **You're in!** 🎉

---

## 📸 Screenshots Reference

### Google Console - Authorized redirect URIs
```
http://localhost:3001/auth/google/callback
```

### GitHub App - Authorization callback URL
```
http://localhost:3001/auth/github/callback
```

---

## 💡 Tips

- ✅ Use a Google account you have access to
- ✅ Use your GitHub account
- ✅ Don't share the secrets with anyone
- ✅ Keep the .env file safe (it's in .gitignore)

**That's it! OAuth is ready to use!** 🚀
