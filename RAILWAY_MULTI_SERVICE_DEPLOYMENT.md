# Railway Multi-Service Deployment Guide

This guide explains how to deploy both the Node.js backend and Python service from a single repository as separate services on Railway.

## Why Multi-Service Deployment?

Multi-service deployment offers several advantages:
1. Independent scaling of services
2. Better error isolation
3. Independent deployment and rollback
4. More efficient resource utilization

## Deployment Steps

### 1. Create a New Railway Project

1. Go to your Railway dashboard
2. Click "New Project"
3. Select "Empty Project"

### 2. Add Services from Repository

1. Click "Add Service"
2. Connect to your GitHub repository
3. Railway will detect multiple services in your repository

### 3. Configure the Node.js Backend Service

- **Service Name**: medaid-backend
- **Root Directory**: `/backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  MONGO_URI=your_mongodb_connection_string
  GOOGLE_API_KEY=your_google_gemini_api_key
  PORT=5008
  PYTHON_SERVICE_URL=http://medaid-python:5001
  JWT_SECRET=your_jwt_secret
  NODE_ENV=production
  ```

### 4. Configure the Python Service

- **Service Name**: medaid-python
- **Root Directory**: `/backend/python_service`
- **Custom Dockerfile Path**: `railway.dockerfile`
- **Environment Variables**:
  ```
  GOOGLE_API_KEY=your_google_gemini_api_key
  PORT=5001
  ```

### 5. Set Up Service Communication

Railway automatically sets up networking between services in the same project. Services can communicate using their service names:

- Backend can reach Python service at: `http://medaid-python:5001`
- Python service can reach Backend at: `http://medaid-backend:5008`

### 6. Configure Domains

- **Backend**: Railway will automatically assign a domain (e.g., `medaid-backend-production.up.railway.app`)
- **Frontend**: Deploy separately on Vercel

### 7. Environment-Specific Configuration

For local development, the services will use:
- Backend: `http://localhost:5008`
- Python service: `http://localhost:5001`

For production on Railway:
- Services communicate internally via service names
- External access uses assigned Railway domains

## Health Checks

Both services expose health check endpoints:
- Backend: `/api/health`
- Python service: `/health`

## Troubleshooting

### Common Issues

1. **Services can't communicate**: 
   - Ensure service names match in environment variables
   - Check that both services are in the same Railway project

2. **Python service not starting**:
   - Verify GOOGLE_API_KEY is set
   - Check Railway logs for dependency installation errors

3. **Backend can't reach Python service**:
   - Verify PYTHON_SERVICE_URL is set correctly
   - Check that the Python service is running (check logs)

### Debugging Steps

1. Check Railway logs for both services
2. Verify environment variables are set correctly
3. Test health endpoints:
   - Backend: `https://your-backend-domain.up.railway.app/api/health`
   - Python: `https://your-python-domain.up.railway.app/health`

## Best Practices

1. **Environment Variables**: Never commit sensitive information to the repository
2. **Service Names**: Use descriptive service names for easier debugging
3. **Health Checks**: Implement health checks in all services
4. **Logging**: Add comprehensive logging for debugging
5. **Error Handling**: Implement proper error handling and fallbacks