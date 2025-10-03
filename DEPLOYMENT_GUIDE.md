# MedAid Deployment Guide

This guide will help you deploy the MedAid application so others can access it through a link.

## Prerequisites

1. GitHub account
2. MongoDB Atlas account (free tier available)
3. Google Gemini API key

## Option 1: Railway Deployment (Recommended for Beginners)

### Step 1: Prepare Your Code

1. Create a GitHub repository for your project
2. Push your code to GitHub

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up/sign in
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables

In Railway, go to your project settings and add these environment variables:
```
MONGO_URI=your_mongodb_atlas_connection_string
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=5008
PYTHON_SERVICE_URL=http://localhost:5001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### Step 4: Configure MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Add IP whitelist (0.0.0.0/0 for testing)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/medaid?retryWrites=true&w=majority
   ```

### Step 5: Configure Google Gemini API

1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Create an API key
3. Enable the Gemini API
4. Copy your API key

### Step 6: Start the Python Service

The Python service needs to be started separately. You can do this by:

1. SSH into your Railway deployment
2. Navigate to the python_service directory
3. Run: `python3 medical_analyzer.py`

Or create a separate service for the Python backend.

## Option 2: Render Deployment

### Step 1: Prepare Your Code

1. Create a GitHub repository for your project
2. Push your code to GitHub

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up/sign in
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: medaid-backend
   - Environment: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: Free

### Step 3: Configure Environment Variables

In Render, add these environment variables:
```
MONGO_URI=your_mongodb_atlas_connection_string
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=5008
PYTHON_SERVICE_URL=http://localhost:5001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### Step 4: Deploy Frontend to Render

1. Create a new Web Service
2. Connect your same GitHub repository
3. Set the root directory to `/frontend`
4. Configure the service:
   - Name: medaid-frontend
   - Environment: Static Site
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Instance type: Free

### Step 5: Configure Custom Domain (Optional)

1. In your frontend service, go to "Settings"
2. Add a custom domain
3. Follow the DNS instructions

## Option 3: Self-Hosted Deployment

### Step 1: Prepare Your Server

1. Get a VPS (DigitalOcean, Linode, AWS EC2, etc.)
2. Install Docker and Docker Compose:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

### Step 2: Configure Environment Variables

1. Create a `.env` file in your project root:
   ```env
   # MongoDB
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medaid?retryWrites=true&w=majority
   
   # Google Gemini API
   GOOGLE_API_KEY=your_google_gemini_api_key
   
   # Server
   PORT=5008
   PYTHON_SERVICE_URL=http://localhost:5001
   
   # Security
   JWT_SECRET=your_jwt_secret_key_here
   ```

### Step 3: Deploy Using Docker Compose

1. Copy your project to the server
2. Run the deployment:
   ```bash
   cd medaid-mern
   docker-compose up -d
   ```

### Step 4: Set Up Reverse Proxy (Optional but Recommended)

1. Install Nginx:
   ```bash
   sudo apt install nginx
   ```

2. Create Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5175;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api/ {
           proxy_pass https://medaid-b-production.up.railway.app;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/medaid /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Environment Variables Required

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medaid?retryWrites=true&w=majority
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=5008
PYTHON_SERVICE_URL=http://localhost:5001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

## Testing Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Complete a consultation
4. Check that the AI assessment works
5. Verify that reports can be generated

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **API Connection Issues**: Verify environment variables are set correctly
3. **MongoDB Connection**: Check your connection string and IP whitelist
4. **Python Service Issues**: Ensure the Python service is running and accessible

### Logs and Monitoring

1. Check deployment logs in your platform's dashboard
2. Monitor MongoDB Atlas for connection issues
3. Check browser console for frontend errors
4. Check server logs for backend errors

## Scaling Considerations

1. **Database**: Upgrade MongoDB plan as user base grows
2. **Compute**: Scale up server resources based on usage
3. **Caching**: Implement Redis for better performance
4. **Load Balancing**: Use CDN for global distribution

## Security Considerations

1. Use HTTPS (most platforms provide this automatically)
2. Implement rate limiting
3. Use environment variables for secrets
4. Regularly update dependencies
5. Implement proper authentication and authorization

## Cost Estimates

### Free Tier Options
- Render: Free tier with limitations
- Railway: Free tier with limitations
- MongoDB Atlas: Free tier (500MB storage)
- Google Gemini: Free tier (limited requests)

### Paid Options
- VPS: $5-20/month
- MongoDB Atlas: $9-60/month
- Google Gemini: Pay-as-you-go

## Additional Notes

1. The Python service runs on port 5001 and must be started separately
2. Make sure to start both the Node.js backend and Python service
3. The frontend runs on port 5175 in development and port 80 in production
4. The backend runs on port 5008
5. We use Debian-based Node.js image for better compatibility with Python packages
6. Python package versions are pinned to known working combinations to avoid dependency conflicts