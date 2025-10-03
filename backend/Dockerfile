# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create directory for uploads
RUN mkdir -p uploads

# Create directory for Python service
RUN mkdir -p python_service

# Install Python and dependencies for the medical analysis service
RUN apk add --no-cache python3 py3-pip

# Install Python dependencies
RUN pip3 install --no-cache-dir -r python_service/requirements.txt

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]