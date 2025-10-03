# Python Service Deployment Guide for Railway

This guide explains how to deploy the Python service separately on Railway to ensure the medical analysis functionality works correctly.

## Why Deploy Separately?

The Python service needs to run independently because:
1. Railway has limitations when running subprocesses within a service
2. The Python service needs to be accessible via HTTP from the Node.js backend
3. Independent deployment provides better scalability and error handling

## Deployment Steps

### 1. Create a New Railway Service for Python

1. Go to your Railway dashboard
2. Click "New Project" or select an existing project
3. Click "Deploy from GitHub repo"
4. Select your MedAid repository
5. When prompted for the root directory, set it to `/backend/python_service`
6. Set the custom Dockerfile path to `railway.dockerfile`

### 2. Configure Environment Variables

In the Python service settings, add these environment variables:
```
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=5001
```

### 3. Get the Python Service URL

1. After deployment, Railway will provide a URL for your Python service
2. Copy this URL (it will look something like `https://medaid-python.up.railway.app`)

### 4. Update the Node.js Backend

In your Node.js backend service, update the `PYTHON_SERVICE_URL` environment variable:
```
PYTHON_SERVICE_URL=https://your-python-service-url.up.railway.app
```

## Health Check

The Python service exposes a health check endpoint at `/health` which you can use to verify it's running correctly.

## Troubleshooting

If you're still getting mock responses:

1. Check that the Python service is running (check Railway logs)
2. Verify the `PYTHON_SERVICE_URL` environment variable is correctly set in the Node.js backend
3. Ensure the Google API key is correctly configured
4. Check that the Python service can access the internet to call the Gemini API